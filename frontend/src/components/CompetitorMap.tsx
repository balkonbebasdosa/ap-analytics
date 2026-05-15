import { useEffect, useRef, useState } from "react";
import { mapsLoader } from "@/lib/googleMapsLoader";
import type { Competitor, ZoneResult } from "@/types";
import { MapPin } from "lucide-react";
import { formatDistance } from "@/lib/utils";

interface CompetitorMapProps {
  latitude: number;
  longitude: number;
  radiusMeters: number;
  competitors: Competitor[];
  zone?: ZoneResult;
}

const ZONE_COLORS: Record<string, string> = {
  MERAH:   "#1f2e15",  /* pink-100 — restricted */
  KUNING:  "#9fe878",  /* pink-40  — caution */
  HIJAU:   "#1f2e15",  /* green-100 — permitted */
  UNKNOWN: "#1f2e15",
};

const ZONE_LABELS: Record<string, string> = {
  MERAH:   "Zona Merah",
  KUNING:  "Zona Kuning",
  HIJAU:   "Zona Hijau",
  UNKNOWN: "Zona Tidak Diketahui",
};

export default function CompetitorMap({ latitude, longitude, radiusMeters, competitors, zone }: CompetitorMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const circleRef = useRef<google.maps.Circle | null>(null);
  const zoneCircleRef = useRef<google.maps.Circle | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedCompetitor, setSelectedCompetitor] = useState<Competitor | null>(null);

  // Load Google Maps SDK once (shared singleton — avoids "called with different options" error)
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;
    if (!apiKey || apiKey === "your-google-maps-api-key") {
      setLoadError("Google Maps API key not configured.");
      return;
    }
    mapsLoader.load().then(() => setIsLoaded(true)).catch(() => setLoadError("Failed to load map."));
  }, []);

  // Initialize map once the SDK is ready
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    const map = new google.maps.Map(mapRef.current, {
      center: { lat: latitude, lng: longitude },
      zoom: 14,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    mapInstanceRef.current = map;
    infoWindowRef.current = new google.maps.InfoWindow();

    // Business location marker — green-100 with paper outline
    new google.maps.Marker({
      position: { lat: latitude, lng: longitude },
      map,
      title: "Your Location",
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: "#1f2e15",     /* green-100 */
        fillOpacity: 1,
        strokeColor: "#fcfaf8",   /* paper */
        strokeWeight: 3,
      },
      zIndex: 10,
    });

    return () => {
      infoWindowRef.current?.close();
      infoWindowRef.current = null;
      mapInstanceRef.current = null;
    };
  }, [isLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-render circles and competitor markers whenever data changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Zone circle (rendered below the analysis circle, lower zIndex)
    if (zoneCircleRef.current) {
      zoneCircleRef.current.setMap(null);
      zoneCircleRef.current = null;
    }
    if (zone && zone.zone_label !== "UNKNOWN") {
      const color = ZONE_COLORS[zone.zone_label] ?? ZONE_COLORS.UNKNOWN;
      zoneCircleRef.current = new google.maps.Circle({
        center: { lat: latitude, lng: longitude },
        radius: radiusMeters,
        map,
        fillColor: color,
        fillOpacity: 0.12,
        strokeColor: color,
        strokeOpacity: 0.5,
        strokeWeight: 2,
        zIndex: 1,
      });
    }

    // Competitor analysis circle — green-100 outline + green-10 fill
    if (circleRef.current) {
      circleRef.current.setMap(null);
    }
    circleRef.current = new google.maps.Circle({
      center: { lat: latitude, lng: longitude },
      radius: radiusMeters,
      map,
      fillColor: "#1f2e15",     /* green-100 */
      fillOpacity: 0.07,
      strokeColor: "#1f2e15",   /* green-100 */
      strokeOpacity: 0.7,
      strokeWeight: 2,
      zIndex: 2,
    });

    // Clear previous competitor markers
    for (const m of markersRef.current) m.setMap(null);
    markersRef.current = [];

    const infoWindow = infoWindowRef.current;

    for (const competitor of competitors) {
      const marker = new google.maps.Marker({
        position: { lat: competitor.lat, lng: competitor.lng },
        map,
        title: competitor.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 7,
          fillColor: "#9fe878",     /* pink-40 — competitor accent */
          fillOpacity: 1,
          strokeColor: "#1f2e15",   /* pink-100 outline */
          strokeWeight: 2,
        },
        zIndex: 5,
      });

      marker.addListener("click", () => {
        setSelectedCompetitor(competitor);
        if (infoWindow) {
          infoWindow.setContent(`
            <div style="padding:4px;max-width:180px">
              <div style="font-weight:600;font-size:13px;margin-bottom:2px">${competitor.name}</div>
              <div style="font-size:11px;color:#666">${competitor.type.replace(/_/g, " ")}</div>
              ${competitor.rating ? `<div style="font-size:11px;margin-top:4px">⭐ ${competitor.rating} (${competitor.userRatingsTotal?.toLocaleString() || 0} reviews)</div>` : ""}
              <div style="font-size:11px;color:#666;margin-top:2px">${formatDistance(competitor.distanceMeters)} away</div>
            </div>
          `);
          infoWindow.open(map, marker);
        }
      });

      markersRef.current.push(marker);
    }

    return () => {
      if (zoneCircleRef.current) {
        zoneCircleRef.current.setMap(null);
        zoneCircleRef.current = null;
      }
      if (circleRef.current) {
        circleRef.current.setMap(null);
        circleRef.current = null;
      }
      for (const m of markersRef.current) m.setMap(null);
      markersRef.current = [];
    };
  }, [isLoaded, latitude, longitude, radiusMeters, competitors, zone]);

  if (loadError) {
    return (
      <div className="flex h-72 items-center justify-center"
           style={{ background: "var(--mist)", borderRadius: 20 }}>
        <p style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: 12, fontWeight: 600, letterSpacing: "0.04em",
          color: "var(--deep)",
        }}>{loadError}</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex h-72 items-center justify-center"
           style={{ background: "var(--mist)", borderRadius: 20 }}>
        <div className="h-6 w-6 animate-spin rounded-full"
             style={{ border: "3px solid var(--soft)", borderTopColor: "var(--deep)" }} />
      </div>
    );
  }

  const zoneLabel = zone?.zone_label ?? "UNKNOWN";
  const zoneColor = ZONE_COLORS[zoneLabel] ?? ZONE_COLORS.UNKNOWN;

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden" style={{ borderRadius: 20 }}>
        <div ref={mapRef} className="h-72 w-full" />
        {zone && zone.zone_label !== "UNKNOWN" && (
          <div
            style={{
              position: "absolute", bottom: 12, left: 12,
              display: "inline-flex", alignItems: "center", gap: 6,
              background: zoneColor,
              color: zoneColor === "#9fe878" ? "#1f2e15" : "#e8efd6",
              padding: "5px 14px",
              borderRadius: 999,
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            <span style={{
              width: 8, height: 8, borderRadius: 999,
              background: zoneColor === "#9fe878" ? "#1f2e15" : "#9fe878",
            }} />
            {ZONE_LABELS[zoneLabel]}
          </div>
        )}
      </div>
      {selectedCompetitor && (
        <div className="compartment-well" style={{
          display: "flex", alignItems: "flex-start", gap: 12,
          padding: "14px 16px",
        }}>
          <MapPin style={{ marginTop: 2, width: 16, height: 16, flexShrink: 0, color: "var(--bright)" }} />
          <div>
            <div style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: 15, fontWeight: 500, color: "var(--deep)",
            }}>
              {selectedCompetitor.name}
            </div>
            <div style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: 10, letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "color-mix(in srgb, var(--deep) 60%, transparent)",
              marginTop: 2,
            }}>
              {selectedCompetitor.type.replace(/_/g, " ")} · {formatDistance(selectedCompetitor.distanceMeters)} away
              {selectedCompetitor.rating && ` · ★ ${selectedCompetitor.rating}`}
            </div>
            <div style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontStyle: "italic", fontWeight: 300,
              fontSize: 12, color: "color-mix(in srgb, var(--deep) 65%, transparent)",
              marginTop: 2,
            }}>
              {selectedCompetitor.vicinity}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
