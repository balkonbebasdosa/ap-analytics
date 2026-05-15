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

  let nextPageToken: string | undefined = undefined;
  let pageCount = 0;
  const maxPages = 3; // Up to 60 results

  do {
    const url = new URL("https://maps.googleapis.com/maps/api/place/nearbysearch/json");
    url.searchParams.set("key", process.env.GOOGLE_MAPS_API_KEY ?? "");

    if (nextPageToken) {
      url.searchParams.set("pagetoken", nextPageToken);
      // Google API requires a short delay before the next_page_token is valid
      await new Promise(resolve => setTimeout(resolve, 2000));
    } else {
      url.searchParams.set("location", `${lat},${lng}`);
      url.searchParams.set("radius", String(Math.min(radiusMeters, 50000)));
      url.searchParams.set("type", category);
    }

    console.log(`GOOGLE_PLACES_REQUEST_PAGE_${pageCount + 1}`);

    try {
      const response = await fetch(url.toString());
      const data = await response.json() as GooglePlacesNearbyResponse;
      
      console.log(`GOOGLE_PLACES_RESPONSE_STATUS_PAGE_${pageCount + 1}:`, data.status);

      if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
        console.error("GOOGLE_PLACES_ERROR_DATA:", data);
        break; // Stop fetching if error
      }

      const results = data.results || [];
      for (const place of results) {
        if (seen.has(place.place_id)) continue;

        if (place.types.some(t => BLACKLISTED_TYPES.includes(t))) {
          continue;
        }

        // STRICT FILTER: Ensure the place actually belongs to the requested category.
        // Google Maps sometimes ignores the 'type' parameter and returns generic nearby places.
        if (!place.types.includes(category)) {
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

      nextPageToken = data.next_page_token;
      pageCount++;

    } catch (error) {
      console.error("GOOGLE_PLACES_FETCH_ERROR:", error);
      break;
    }
  } while (nextPageToken && pageCount < maxPages);

  console.log("FINAL_COMPETITOR_COUNT:", allResults.length);

  return allResults.sort((a, b) => a.distanceMeters - b.distanceMeters);
}
