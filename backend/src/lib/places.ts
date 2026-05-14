export interface PlaceResult {
  name: string;
  type: string;
  allTypes: string[];
  rating: number | null;
  userRatingsTotal: number | null;
  priceLevel: number | null;
  vicinity: string;
  placeId: string;
  lat: number;
  lng: number;
  distanceMeters: number;
}

interface GooglePlacesNearbyResult {
  name: string;
  types: string[];
  rating?: number;
  user_ratings_total?: number;
  price_level?: number;
  vicinity: string;
  place_id: string;
  geometry: {
    location: { lat: number; lng: number };
  };
}

interface GooglePlacesNearbyResponse {
  results: GooglePlacesNearbyResult[];
  next_page_token?: string;
  status: string;
}

const BLACKLISTED_TYPES = ["place_of_worship", "bank"];

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function fetchNearbyCompetitors(
  lat: number,
  lng: number,
  radiusMeters: number,
  category: string
): Promise<PlaceResult[]> {
  console.log("FETCH_COMPETITORS_START:", { lat, lng, radiusMeters, category });
  
  const allResults: PlaceResult[] = [];
  const seen = new Set<string>();

  const url = new URL("https://maps.googleapis.com/maps/api/place/nearbysearch/json");
  url.searchParams.set("location", `${lat},${lng}`);
  url.searchParams.set("radius", String(Math.min(radiusMeters, 50000)));
  url.searchParams.set("key", process.env.GOOGLE_MAPS_API_KEY ?? "");
  url.searchParams.set("type", category);

  console.log("GOOGLE_PLACES_REQUEST_URL:", url.toString());

  try {
    const response = await fetch(url.toString());
    const data = await response.json() as GooglePlacesNearbyResponse;
    
    console.log("GOOGLE_PLACES_RESPONSE_STATUS:", data.status);

    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      console.error("GOOGLE_PLACES_ERROR_DATA:", data);
      return [];
    }

    const results = data.results || [];
    for (const place of results) {
      if (seen.has(place.place_id)) continue;

      if (place.types.some(t => BLACKLISTED_TYPES.includes(t))) {
        continue;
      }

      seen.add(place.place_id);

      const dist = haversineDistance(lat, lng, place.geometry.location.lat, place.geometry.location.lng);
      
      if (dist > radiusMeters) {
        continue;
      }

      allResults.push({
        name: place.name,
        type: place.types[0] || "establishment",
        allTypes: place.types,
        rating: place.rating ?? null,
        userRatingsTotal: place.user_ratings_total ?? null,
        priceLevel: place.price_level ?? null,
        vicinity: place.vicinity,
        placeId: place.place_id,
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
        distanceMeters: Math.round(dist),
      });
    }
  } catch (error) {
    console.error("GOOGLE_PLACES_FETCH_ERROR:", error);
  }

  console.log("FINAL_COMPETITOR_COUNT:", allResults.length);

  return allResults.sort((a, b) => a.distanceMeters - b.distanceMeters);
}
