import { cache } from "react";
import type { Route } from "@/lib/routes";
import { getRoutes } from "@/lib/routes";
import {
  getDestinations,
  hasGuide,
  isRouteIndexable,
  routeSeoRank,
  type Destination,
  type DestinationMap,
} from "@/lib/destinations";
import { lowestPrice, priceRange } from "@/lib/pricing";
import { isAirportOrigin, toSlug } from "@/lib/slug";

/**
 * Destination hubs: one page per main destination (/tamarindo-shuttle,
 * /es/tamarindo-shuttle…) that gathers every priced shuttle from and to it,
 * the destination guide and the questions travellers ask before booking.
 *
 * Which destinations get a hub is decided here, from data, never by hand:
 * tier 1 or 2 in `destinations_ruta_pacifico`, with guide copy, that is not
 * an airport (LIR has its own hub at /liberia-airport-shuttle) and has at
 * least one priced, index-able route. A destination added to the table
 * with those properties gets its page on the next regeneration; one that
 * loses its routes drops out, so a hub can never be an empty page.
 *
 * Public URL: `/${destination.slug}-shuttle`. The page itself lives at
 * app/[lang]/shuttle/[destination]; next.config.ts rewrites the public
 * path onto it (and redirects the internal path back) so each hub exists
 * at exactly one address per language.
 */
export const HUB_SUFFIX = "-shuttle";

/** Public, language-less path of a destination's hub. */
export function hubPath(destinationSlug: string): string {
  return `/${destinationSlug}${HUB_SUFFIX}`;
}

/** App-router path of a hub in one language, for revalidatePath. */
export function hubAppPath(lang: string, destinationSlug: string): string {
  return `/${lang}/shuttle/${destinationSlug}`;
}

export interface DestinationHub {
  destination: Destination;
  /** `destination.slug`; the URL segment of the page. */
  slug: string;
  /** Public path, e.g. "/tamarindo-shuttle". */
  path: string;
  /** Priced, index-able routes leaving the destination, most important first. */
  from: Route[];
  /** Priced, index-able routes arriving at the destination, most important first. */
  to: Route[];
  /** Cheapest and dearest published price across both lists. */
  range: { low: number; high: number } | null;
  /** LIR → destination, when sold: the route the answer line is built on. */
  lirRoute: Route | undefined;
  /** destination → LIR, when sold. */
  lirReturn: Route | undefined;
  /** Other hub destinations in the same region, for the "nearby" block. */
  related: Destination[];
  /** Latest route edit touching the hub, for lastmod / dateModified. */
  updatedAt: string | null;
}

const LIR = /\bLIR\b/;

function isHubCandidate(d: Destination): boolean {
  return d.tier <= 2 && hasGuide(d) && !isAirportOrigin(d.name);
}

function byRank(map: DestinationMap) {
  return (a: Route, b: Route) =>
    routeSeoRank(a, map) - routeSeoRank(b, map) ||
    (lowestPrice(a) ?? Infinity) - (lowestPrice(b) ?? Infinity) ||
    a.origen.localeCompare(b.origen) ||
    a.destino.localeCompare(b.destino);
}

function latest(routes: Route[]): string | null {
  let out: string | null = null;
  for (const r of routes) {
    if (r.updated_at && (!out || r.updated_at > out)) out = r.updated_at;
  }
  return out;
}

/**
 * Every hub, built from the routes table and the destinations map. Pure, so
 * llms.txt, the sitemap and the pages all derive the same list from the
 * same inputs; `getDestinationHubs()` below adds the per-request cache.
 */
export function buildDestinationHubs(routes: Route[], map: DestinationMap): DestinationHub[] {
  const priced = routes.filter((r) => lowestPrice(r) && isRouteIndexable(r, map));
  const candidates = [...map.values()].filter(isHubCandidate);
  const hubs: DestinationHub[] = [];

  for (const destination of candidates) {
    const from = priced.filter((r) => toSlug(r.origen) === destination.slug).sort(byRank(map));
    const to = priced.filter((r) => toSlug(r.destino) === destination.slug).sort(byRank(map));
    if (from.length === 0 && to.length === 0) continue;
    const all = [...to, ...from];
    hubs.push({
      destination,
      slug: destination.slug,
      path: hubPath(destination.slug),
      from,
      to,
      range: priceRange(all),
      lirRoute: to.find((r) => LIR.test(r.origen)),
      lirReturn: from.find((r) => LIR.test(r.destino)),
      related: [],
      updatedAt: latest(all),
    });
  }

  // Nearby: the other hubs of the same region, tier 1 first, then by name.
  for (const hub of hubs) {
    hub.related = hubs
      .filter((h) => h !== hub && h.destination.region === hub.destination.region)
      .map((h) => h.destination)
      .sort((a, b) => a.tier - b.tier || a.short_name.localeCompare(b.short_name));
  }

  // Tier 1 hubs first, then the Guanacaste beaches in table order by name.
  return hubs.sort(
    (a, b) =>
      a.destination.tier - b.destination.tier ||
      b.to.length + b.from.length - (a.to.length + a.from.length) ||
      a.destination.short_name.localeCompare(b.destination.short_name),
  );
}

/** All hubs, once per request (routes are memoised per process as well). */
export const getDestinationHubs = cache(async (): Promise<DestinationHub[]> => {
  const [routes, destinations] = await Promise.all([getRoutes(), getDestinations()]);
  return buildDestinationHubs(routes, destinations);
});

/** The hub of a destination slug ("tamarindo-guanacaste"), or undefined. */
export async function findDestinationHub(slug: string): Promise<DestinationHub | undefined> {
  return (await getDestinationHubs()).find((h) => h.slug === slug);
}

/** Hub for a raw route place name ("Tamarindo (Guanacaste)"), or undefined. */
export function hubForPlace(place: string, hubs: DestinationHub[]): DestinationHub | undefined {
  const slug = toSlug(place);
  return hubs.find((h) => h.slug === slug);
}

/** First paragraph of a Markdown block as plain text, for descriptions. */
export function plainParagraph(md: string | undefined): string {
  if (!md) return "";
  const first = md.trim().split(/\n\s*\n/)[0] ?? "";
  return first
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`#>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
