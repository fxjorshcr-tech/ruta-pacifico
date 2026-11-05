import { cache } from "react";
import { getSupabase } from "@/lib/supabase";
import { toSlug } from "@/lib/slug";
import type { Route } from "@/lib/routes";
import { pickLocale, type Locale } from "@/lib/i18n";

/**
 * Destination guides + SEO tiers (table: destinations_ruta_pacifico).
 *
 * The shared `routes` table holds ~1,400 origin/destination pairs. Letting
 * search engines index all of them produces 1,400 near-identical pages —
 * a doorway-page pattern that dilutes authority and wastes crawl budget.
 * This module decides which route pages deserve an index-able URL and
 * supplies the unique per-destination copy that makes those pages worth
 * ranking.
 *
 * Tiers:
 *   1  hub          airports + La Fortuna, Monteverde, Manuel Antonio
 *   2  core beach   Guanacaste beach towns travellers search by name
 *   3  hub-linked   index-able only when the other end is a tier-1 hub
 *   4  noindex      bookable, but no search-engine page
 *
 * Rule: a route is index-able when both endpoints are tier ≤ 3 AND
 * (one endpoint is tier 1 OR both endpoints are tier 2).
 *
 * If the table is missing or unreachable the map is empty and every
 * route falls back to index-able (today's behaviour) so a DB hiccup can
 * never de-index the site.
 */
export type DestinationTier = 1 | 2 | 3 | 4;

export interface Destination {
  slug: string;
  name: string;
  short_name: string;
  region: string;
  tier: DestinationTier;
  intro_md: string;
  arrival_md: string;
  tips_md: string;
  best_for: string[];
  image_url: string | null;
  image_alt: string | null;
  /** Spanish twins (supabase/i18n_es_schema.sql); see `localizeDestination`. */
  intro_md_es?: string | null;
  arrival_md_es?: string | null;
  tips_md_es?: string | null;
  best_for_es?: string[] | null;
  image_alt_es?: string | null;
}

export type DestinationMap = Map<string, Destination>;

/** `*` so the optional Spanish columns are read when present and absent before the migration runs. */
const COLUMNS = "*";

/** The guide copy in the requested language, English wherever Spanish is not filled in yet. */
export function localizeDestination(d: Destination, locale: Locale): Destination {
  if (locale === "en") return d;
  return {
    ...d,
    intro_md: pickLocale(locale, d.intro_md_es, d.intro_md),
    arrival_md: pickLocale(locale, d.arrival_md_es, d.arrival_md),
    tips_md: pickLocale(locale, d.tips_md_es, d.tips_md),
    best_for: d.best_for_es?.length ? d.best_for_es : d.best_for,
    image_alt: pickLocale(locale, d.image_alt_es, d.image_alt),
  };
}

/** All destinations keyed by slug. Deduplicated per request via React cache. */

/**
 * Photos for the destinations that have none in the table yet, keyed by
 * slug. Applied when `image_url` is empty, so the hub pages, the index and
 * the route guides show the place instead of one shared hero. Setting the
 * columns in Supabase (supabase/destinations_images.sql) overrides this.
 */
const DESTINATION_IMAGE_FALLBACKS: Record<string, { image_url: string; image_alt: string; image_alt_es: string }> = {
  "lir-liberia-int-airport": {
    image_url: "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/aeropuerto-LIR-guanacaste.webp",
    image_alt: "Liberia International Airport (LIR), Guanacaste",
    image_alt_es: "Aeropuerto Internacional de Liberia (LIR), Guanacaste",
  },
  "la-fortuna-arenal": {
    image_url: "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/arenal-view.webp",
    image_alt: "Arenal Volcano, La Fortuna",
    image_alt_es: "Volcán Arenal, La Fortuna",
  },
  "monteverde-cloud-forest": {
    image_url: "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/cloud-forest-monteverde-costa-rica-trees.webp",
    image_alt: "Monteverde Cloud Forest",
    image_alt_es: "Bosque Nuboso de Monteverde",
  },
  "manuel-antonio-quepos": {
    image_url: "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/capuchin-monkey-manuel-antonio-costa-rica.webp",
    image_alt: "Capuchin monkey, Manuel Antonio National Park",
    image_alt_es: "Mono capuchino, Parque Nacional Manuel Antonio",
  },
  "tamarindo-guanacaste": {
    image_url: "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/tamarindo-beach-costa-rica.webp",
    image_alt: "Tamarindo Beach, Guanacaste",
    image_alt_es: "Playa Tamarindo, Guanacaste",
  },
  "flamingo-guanacaste": {
    image_url: "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/guanacaste-beach-sunset-costa-rica.webp",
    image_alt: "Sunset on the Flamingo coast, Guanacaste",
    image_alt_es: "Atardecer en la costa de Flamingo, Guanacaste",
  },
  "conchal-guanacaste": {
    image_url: "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/aerial-view-conchal-beach.webp",
    image_alt: "Playa Conchal from the air, Guanacaste",
    image_alt_es: "Playa Conchal desde el aire, Guanacaste",
  },
  "playa-potrero-guanacaste": {
    image_url: "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/costa-rica-beach-travel.webp",
    image_alt: "Beach near Playa Potrero, Guanacaste",
    image_alt_es: "Playa cerca de Potrero, Guanacaste",
  },
  "las-catalinas-guanacaste": {
    image_url: "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/summer-time-beach-costarica.webp",
    image_alt: "Beach at Las Catalinas, Guanacaste",
    image_alt_es: "Playa en Las Catalinas, Guanacaste",
  },
  "playa-grande-guanacaste": {
    image_url: "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/playa_tamarindo_kristen_brown.jpg",
    image_alt: "Surfer at sunset, Playa Grande",
    image_alt_es: "Surfista al atardecer, Playa Grande",
  },
  "papagayo-peninsula-guanacaste": {
    image_url: "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/buseta-papagayo.webp",
    image_alt: "Ruta Pacifico shuttle on the Papagayo Peninsula",
    image_alt_es: "Shuttle de Ruta Pacifico en la Península de Papagayo",
  },
  "playas-del-coco-guanacaste": {
    image_url: "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/tamarindo-Costa-rica.jpg",
    image_alt: "Cove near Playas del Coco, Guanacaste",
    image_alt_es: "Ensenada cerca de Playas del Coco, Guanacaste",
  },
  "playa-hermosa-guanacaste": {
    image_url: "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Ruta%20Pacifico/hero-ruta-pacifico.webp",
    image_alt: "Playa Hermosa, Guanacaste",
    image_alt_es: "Playa Hermosa, Guanacaste",
  },
  "nosara-playa-guiones-area": {
    image_url: "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/nosara-beach-surf-guanacaste.jpg",
    image_alt: "Surf at Playa Guiones, Nosara",
    image_alt_es: "Surf en Playa Guiones, Nosara",
  },
  "samara-playa-carrillo-guanacaste": {
    image_url: "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/Conchal-beach-guanacaste.webp",
    image_alt: "Beach near Sámara, Guanacaste",
    image_alt_es: "Playa cerca de Sámara, Guanacaste",
  },
};

/** The row with a photo filled in from the fallback table when it has none. */
function withImageFallback(d: Destination): Destination {
  if (d.image_url) return d;
  const fb = DESTINATION_IMAGE_FALLBACKS[d.slug];
  return fb ? { ...d, image_url: fb.image_url, image_alt: d.image_alt ?? fb.image_alt, image_alt_es: d.image_alt_es ?? fb.image_alt_es } : d;
}

export const getDestinations = cache(async (): Promise<DestinationMap> => {
  const map: DestinationMap = new Map();
  try {
    const { data, error } = await getSupabase()
      .from("destinations_ruta_pacifico")
      .select(COLUMNS);
    if (error) {
      console.error("Failed to fetch destinations:", error.message);
      return map;
    }
    for (const row of (data ?? []) as Destination[]) {
      map.set(row.slug, withImageFallback({ ...row, best_for: row.best_for ?? [] }));
    }
  } catch (err) {
    console.error("Failed to fetch destinations:", err);
  }
  return map;
});

export function destinationFor(
  place: string,
  map: DestinationMap
): Destination | undefined {
  return map.get(toSlug(place));
}

function tierOf(place: string, map: DestinationMap): DestinationTier {
  return destinationFor(place, map)?.tier ?? 4;
}

/** See the module comment for the rule. Empty map ⇒ everything index-able. */
export function isRouteIndexable(route: Route, map: DestinationMap): boolean {
  if (map.size === 0) return true;
  const a = tierOf(route.origen, map);
  const b = tierOf(route.destino, map);
  if (a === 4 || b === 4) return false;
  return a === 1 || b === 1 || (a === 2 && b === 2);
}

const AIRPORT = /\b(LIR|SJO)\b/;

/**
 * Lower = more important. Used to order sitemaps, ItemLists and related-route
 * lists: airport pickups first, then trips back to the airport, then the
 * inland hubs and beach ↔ beach pairs.
 */
export function routeSeoRank(route: Route, map: DestinationMap): number {
  const a = tierOf(route.origen, map);
  const b = tierOf(route.destino, map);
  const airport = AIRPORT.test(route.origen)
    ? 0
    : AIRPORT.test(route.destino)
      ? 1
      : 2;
  return airport * 10 + Math.min(a, b) * 3 + Math.max(a, b);
}

/** Sitemap <priority> derived from the tier pair. */
export function routeSitemapPriority(route: Route, map: DestinationMap): number {
  const a = tierOf(route.origen, map);
  const b = tierOf(route.destino, map);
  const touchesAirport = AIRPORT.test(route.origen + route.destino);
  if (touchesAirport && Math.max(a, b) <= 2) return 0.8; // airport ↔ hub/beach
  if (touchesAirport) return 0.7; // airport ↔ hotel/tier-3 spot
  return 0.6; // inland hubs, beach ↔ beach
}

/** Index-able routes only, most important first. */
export function selectIndexableRoutes(
  routes: Route[],
  map: DestinationMap
): Route[] {
  return routes
    .filter((r) => isRouteIndexable(r, map))
    .sort(
      (x, y) =>
        routeSeoRank(x, map) - routeSeoRank(y, map) ||
        x.origen.localeCompare(y.origen) ||
        x.destino.localeCompare(y.destino)
    );
}

/** True when the destination has enough copy to render a guide section. */
export function hasGuide(d: Destination | undefined): d is Destination {
  return Boolean(d && d.tier <= 3 && d.intro_md.trim());
}
