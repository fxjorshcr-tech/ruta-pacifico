import { cache } from "react";
import { GOOGLE_BUSINESS_PROFILE_URL, GOOGLE_RATING_FALLBACK } from "@/lib/contact";

/**
 * Live star rating and review count of the Google Business Profile.
 *
 * Read from the Places API (New) so the review badges, the Organization
 * JSON-LD and llms.txt always show what Google itself shows; nobody edits
 * a number by hand when a review comes in. One request every
 * `REVALIDATE` seconds is served from Next's data cache (well inside the
 * free monthly Places quota). Without `GOOGLE_PLACES_API_KEY`, or when
 * Google is unreachable, the last known figures in `GOOGLE_RATING_FALLBACK`
 * are used so the site never renders an empty badge.
 *
 * The profile is matched by its Google CID (the number in the profile's
 * maps.google.com/?cid=… link, also encoded in the g.page short link), so a
 * text search can never pick up a different business by the same name.
 * Set `GOOGLE_PLACE_ID` to skip the search and fetch place details directly.
 */
export type GoogleRating = {
  /** "5.0", "4.8"… one decimal, as Google displays it. */
  value: string;
  reviewCount: number;
  /** Google Maps link of the profile. */
  url: string;
  /** False when the fallback figures are in use. */
  live: boolean;
};

/** Decimal form of the profile's CID (0x81cf0ed61f66a45d in Maps URLs). */
const GOOGLE_CID = "9353711263884420189";
const PLACES_API = "https://places.googleapis.com/v1";
/** 6 hours: a new review shows on the site the same day. */
const REVALIDATE = 6 * 60 * 60;
const TIMEOUT_MS = 4000;

type PlaceFields = {
  id?: string;
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
};

const FALLBACK: GoogleRating = {
  value: GOOGLE_RATING_FALLBACK.value,
  reviewCount: GOOGLE_RATING_FALLBACK.reviewCount,
  url: GOOGLE_BUSINESS_PROFILE_URL,
  live: false,
};

/** Place ID resolved by the CID search, kept for the life of the server. */
let resolvedPlaceId: string | undefined;

function matchesProfile(place: PlaceFields): boolean {
  return place.googleMapsUri?.includes(`cid=${GOOGLE_CID}`) ?? false;
}

async function fetchDetails(key: string, placeId: string): Promise<PlaceFields | null> {
  const res = await fetch(`${PLACES_API}/places/${encodeURIComponent(placeId)}`, {
    headers: {
      "X-Goog-Api-Key": key,
      "X-Goog-FieldMask": "id,rating,userRatingCount,googleMapsUri",
    },
    next: { revalidate: REVALIDATE },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) {
    console.error(`Google Places details failed: ${res.status} ${await res.text()}`);
    return null;
  }
  return (await res.json()) as PlaceFields;
}

async function searchByCid(key: string): Promise<PlaceFields | null> {
  const res = await fetch(`${PLACES_API}/places:searchText`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": key,
      "X-Goog-FieldMask": "places.id,places.rating,places.userRatingCount,places.googleMapsUri",
    },
    body: JSON.stringify({
      textQuery: "Ruta Pacifico shuttle Liberia Guanacaste",
      regionCode: "CR",
      locationBias: {
        circle: { center: { latitude: 10.5933, longitude: -85.5444 }, radius: 50000 },
      },
    }),
    next: { revalidate: REVALIDATE },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) {
    console.error(`Google Places search failed: ${res.status} ${await res.text()}`);
    return null;
  }
  const data = (await res.json()) as { places?: PlaceFields[] };
  return data.places?.find(matchesProfile) ?? null;
}

function toRating(place: PlaceFields): GoogleRating | null {
  if (typeof place.rating !== "number" || typeof place.userRatingCount !== "number") return null;
  if (place.userRatingCount < 1) return null;
  return {
    value: place.rating.toFixed(1),
    reviewCount: place.userRatingCount,
    url: place.googleMapsUri ?? GOOGLE_BUSINESS_PROFILE_URL,
    live: true,
  };
}

export const getGoogleRating = cache(async (): Promise<GoogleRating> => {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) return FALLBACK;
  try {
    const placeId = process.env.GOOGLE_PLACE_ID || resolvedPlaceId;
    let place: PlaceFields | null = null;
    if (placeId) {
      place = await fetchDetails(key, placeId);
      // A wrong GOOGLE_PLACE_ID would otherwise publish another business's stars.
      if (place && !matchesProfile(place)) {
        console.error(`Google place ${placeId} is not the Ruta Pacifico profile (cid=${GOOGLE_CID})`);
        place = null;
      }
    }
    if (!place) {
      place = await searchByCid(key);
      if (place?.id) resolvedPlaceId = place.id;
    }
    return (place && toRating(place)) ?? FALLBACK;
  } catch (err) {
    console.error("Failed to fetch Google rating:", err);
    return FALLBACK;
  }
});
