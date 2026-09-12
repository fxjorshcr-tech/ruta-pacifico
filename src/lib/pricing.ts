import type { Route } from "@/lib/routes";
import {
  isRouteIndexable,
  routeSeoRank,
  type DestinationMap,
} from "@/lib/destinations";
import { durationMinutes, formatDuration } from "@/lib/routeFaqs";
import { routeSlug } from "@/lib/slug";
import { VEHICLE_TIERS, type VehicleTier } from "@/lib/vehicles";

/**
 * Public price list helpers.
 *
 * Every route price already lives in the `routes` table and is rendered on
 * its own route page, but the entry points that answer engines actually
 * read first (llms.txt, the booking page, the home page) carried no figures
 * at all — so ChatGPT, Perplexity and friends concluded "Ruta Pacifico does
 * not publish prices". This module is the single place that turns the
 * table into something a crawler can quote: the /prices page, the
 * llms*.txt files and the "popular routes" blocks all read from here.
 */

export const BASE_URL = "https://rutapacifico.com";
export const PRICE_LIST_PATH = "/prices";

/** Plain-language facts repeated wherever a price is shown. */
export const PRICE_FACTS = [
  "Prices are in US dollars, per vehicle, not per person.",
  "13% VAT, fuel, tolls, the driver, WiFi, water and child seats are all included.",
  "The same fixed price applies every day of the year: no peak-season, holiday, night or airport surcharge.",
  "Book online and the price shown at checkout is the price charged. Nothing is paid at pickup.",
];

export interface RoutePrice {
  tier: VehicleTier;
  price: number;
}

/** Published prices for a route, lowest tier first. Tiers without a price are skipped. */
export function routePrices(route: Route): RoutePrice[] {
  const out: RoutePrice[] = [];
  for (const tier of VEHICLE_TIERS) {
    const price = route[tier.priceField];
    if (typeof price === "number" && price > 0) out.push({ tier, price });
  }
  return out;
}

export function lowestPrice(route: Route): number | null {
  return routePrices(route)[0]?.price ?? null;
}

export function routeUrl(route: Route): string {
  return `${BASE_URL}/private-shuttle/${routeSlug(route.origen, route.destino)}`;
}

/** "about 1 hour 15 minutes" from the free-form `duracion` column, or the raw value. */
export function travelTime(route: Route): string {
  const minutes = durationMinutes(route.duracion);
  return minutes ? formatDuration(minutes) : route.duracion || "varies";
}

const LIR = /\bLIR\b/;
const SJO = /\bSJO\b/;

export type PriceGroupKey =
  | "from-lir"
  | "to-lir"
  | "from-sjo"
  | "to-sjo"
  | "between";

export interface PriceGroup {
  key: PriceGroupKey;
  title: string;
  blurb: string;
  routes: Route[];
}

const GROUP_META: Record<PriceGroupKey, { title: string; blurb: string }> = {
  "from-lir": {
    title: "From Liberia Airport (LIR)",
    blurb:
      "Airport pickup at Daniel Oduber Quirós International Airport, Liberia. Driver meets you at the arrivals exit with a name sign; flights are tracked in real time.",
  },
  "to-lir": {
    title: "To Liberia Airport (LIR)",
    blurb:
      "Hotel, villa or beach pickup for your departure flight from Liberia. We schedule the pickup so you arrive about 3 hours before an international departure.",
  },
  "from-sjo": {
    title: "From San José Airport (SJO)",
    blurb:
      "Pickup at Juan Santamaría International Airport, San José, to the Guanacaste coast and the rest of the country.",
  },
  "to-sjo": {
    title: "To San José Airport (SJO)",
    blurb: "Transfers to Juan Santamaría International Airport for departures.",
  },
  between: {
    title: "Between beaches, towns and destinations",
    blurb:
      "Point-to-point private transfers: beach to beach in Guanacaste, and Guanacaste to La Fortuna, Monteverde, Manuel Antonio, San José and back.",
  },
};

export function priceGroupOf(route: Route): PriceGroupKey {
  if (LIR.test(route.origen)) return "from-lir";
  if (LIR.test(route.destino)) return "to-lir";
  if (SJO.test(route.origen)) return "from-sjo";
  if (SJO.test(route.destino)) return "to-sjo";
  return "between";
}

function byPriceThenName(a: Route, b: Route): number {
  return (
    (lowestPrice(a) ?? Infinity) - (lowestPrice(b) ?? Infinity) ||
    a.origen.localeCompare(b.origen) ||
    a.destino.localeCompare(b.destino)
  );
}

function byName(a: Route, b: Route): number {
  return a.origen.localeCompare(b.origen) || a.destino.localeCompare(b.destino);
}

/**
 * Routes with at least one published price, split into the groups a traveller
 * thinks in. Airport groups are ordered cheapest first (closest beaches on
 * top); the long "between" list is alphabetical so it is scannable.
 */
export function groupRoutesForPriceList(
  routes: Route[],
  opts: { indexableOnly?: boolean; destinations?: DestinationMap } = {}
): PriceGroup[] {
  const priced = routes.filter((r) => {
    if (!lowestPrice(r)) return false;
    if (opts.indexableOnly && opts.destinations) {
      return isRouteIndexable(r, opts.destinations);
    }
    return true;
  });

  const order: PriceGroupKey[] = [
    "from-lir",
    "to-lir",
    "from-sjo",
    "to-sjo",
    "between",
  ];
  return order
    .map((key) => {
      const members = priced.filter((r) => priceGroupOf(r) === key);
      members.sort(key === "between" ? byName : byPriceThenName);
      return { key, ...GROUP_META[key], routes: members };
    })
    .filter((g) => g.routes.length > 0);
}

/**
 * The airport routes travellers ask about most, ordered by SEO rank (airport
 * pickups to hub/beach destinations first) and then price. Used for the
 * "popular routes" blocks and the short llms.txt table.
 */
export function popularAirportRoutes(
  routes: Route[],
  destinations: DestinationMap,
  limit: number
): Route[] {
  return routes
    .filter(
      (r) =>
        lowestPrice(r) &&
        LIR.test(r.origen) &&
        isRouteIndexable(r, destinations)
    )
    .sort(
      (a, b) =>
        routeSeoRank(a, destinations) - routeSeoRank(b, destinations) ||
        byPriceThenName(a, b)
    )
    .slice(0, limit);
}

/** Cheapest and most expensive published price across a list of routes. */
export function priceRange(routes: Route[]): { low: number; high: number } | null {
  let low = Infinity;
  let high = -Infinity;
  for (const r of routes) {
    for (const { price } of routePrices(r)) {
      if (price < low) low = price;
      if (price > high) high = price;
    }
  }
  return Number.isFinite(low) ? { low, high } : null;
}
