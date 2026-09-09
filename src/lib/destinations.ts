import { cache } from "react";
import { getSupabase } from "@/lib/supabase";
import { toSlug } from "@/lib/slug";
import type { Route } from "@/lib/routes";

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
}

export type DestinationMap = Map<string, Destination>;

const COLUMNS =
  "slug, name, short_name, region, tier, intro_md, arrival_md, tips_md, best_for, image_url, image_alt";

/** All destinations keyed by slug. Deduplicated per request via React cache. */
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
      map.set(row.slug, { ...row, best_for: row.best_for ?? [] });
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
