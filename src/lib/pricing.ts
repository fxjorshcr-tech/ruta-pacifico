import type { Route } from "@/lib/routes";
import {
  isRouteIndexable,
  routeSeoRank,
  type DestinationMap,
} from "@/lib/destinations";
import { durationMinutes, formatDuration } from "@/lib/routeFaqs";
import { routeSlug } from "@/lib/slug";
import { VEHICLE_TIERS, type VehicleTier } from "@/lib/vehicles";
import { defineCopy, localeUrl, type Locale } from "@/lib/i18n";

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
 *
 * The English constants (`PRICE_FACTS`, group titles, "about 1 hour") are
 * what llms.txt quotes and must not change. The UI reads the same text
 * through the locale-aware accessors (`priceFacts`, `priceGroupMeta`,
 * `travelTime(route, locale)`), which return the English text for `en`.
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

/**
 * `PRICE_FACTS` in both languages for the UI. llms.txt and every other
 * crawler-facing text keep reading the English constant above.
 */
export const PRICE_FACTS_COPY = defineCopy({
  en: PRICE_FACTS,
  es: [
    "Los precios son en dólares estadounidenses, por vehículo, no por persona.",
    "El 13% de IVA, el combustible, los peajes, el chofer, WiFi, agua y sillas para niños están incluidos.",
    "El mismo precio fijo aplica todos los días del año: sin recargos por temporada alta, feriados, horario nocturno ni aeropuerto.",
    "Reserva en línea y el precio que ves al pagar es el precio que se cobra. No se paga nada en la recogida.",
  ],
});

/** `PRICE_FACTS` in the given language. */
export function priceFacts(locale: Locale): string[] {
  return PRICE_FACTS_COPY[locale];
}

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

/** Absolute URL of the route page; `/es/...` on the Spanish site. */
export function routeUrl(route: Route, locale: Locale = "en"): string {
  return localeUrl(locale, `/private-shuttle/${routeSlug(route.origen, route.destino)}`);
}

/** Spanish twin of `formatDuration`: "aprox. 1 hora 30 minutos", "aprox. 45 minutos". */
function formatDurationEs(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const min = minutes % 60;
  if (h === 0) return `aprox. ${min} minutos`;
  const hours = `${h} hora${h === 1 ? "" : "s"}`;
  return min ? `aprox. ${hours} ${min} minutos` : `aprox. ${hours}`;
}

/**
 * "about 1 hour 15 minutes" from the free-form `duracion` column, or the raw
 * value. Pass a locale for the UI; llms.txt keeps the English default.
 */
export function travelTime(route: Route, locale: Locale = "en"): string {
  const minutes = durationMinutes(route.duracion);
  if (locale === "es") return minutes ? formatDurationEs(minutes) : route.duracion || "varía";
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

/** `GROUP_META` in both languages; llms.txt keeps reading the English one. */
const GROUP_META_COPY = defineCopy({
  en: GROUP_META,
  es: {
    "from-lir": {
      title: "Desde el Aeropuerto de Liberia (LIR)",
      blurb:
        "Recogida en el Aeropuerto Internacional Daniel Oduber Quirós, Liberia. El chofer te espera a la salida de llegadas con un rótulo con tu nombre; los vuelos se monitorean en tiempo real.",
    },
    "to-lir": {
      title: "Hacia el Aeropuerto de Liberia (LIR)",
      blurb:
        "Recogida en tu hotel, villa o playa para tu vuelo de salida desde Liberia. Programamos la recogida para que llegues unas 3 horas antes de un vuelo internacional.",
    },
    "from-sjo": {
      title: "Desde el Aeropuerto de San José (SJO)",
      blurb:
        "Recogida en el Aeropuerto Internacional Juan Santamaría, San José, hacia la costa de Guanacaste y el resto del país.",
    },
    "to-sjo": {
      title: "Hacia el Aeropuerto de San José (SJO)",
      blurb: "Traslados al Aeropuerto Internacional Juan Santamaría para vuelos de salida.",
    },
    between: {
      title: "Entre playas, pueblos y destinos",
      blurb:
        "Traslados privados punto a punto: de playa a playa en Guanacaste, y de Guanacaste a La Fortuna, Monteverde, Manuel Antonio, San José y de regreso.",
    },
  },
});

/** Title and blurb of a price group in the given language. */
export function priceGroupMeta(
  key: PriceGroupKey,
  locale: Locale = "en"
): { title: string; blurb: string } {
  return GROUP_META_COPY[locale][key];
}

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
 * `opts.locale` picks the language of the group titles and blurbs
 * (English when omitted, as llms.txt expects).
 */
export function groupRoutesForPriceList(
  routes: Route[],
  opts: { indexableOnly?: boolean; destinations?: DestinationMap; locale?: Locale } = {}
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
      return { key, ...priceGroupMeta(key, opts.locale), routes: members };
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


// ---------------------------------------------------------------------------
// Paired price list (the visible tables on /prices)
// ---------------------------------------------------------------------------

export type PairGroupKey = "lir" | "sjo" | "between";

/** One origin/destination pair. `back` is the reverse route when it exists and is priced differently. */
export interface RoutePair {
  out: Route;
  back: Route | null;
}

export interface PairGroup {
  key: PairGroupKey;
  title: string;
  blurb: string;
  pairs: RoutePair[];
}

const PAIR_META_COPY = defineCopy<Record<PairGroupKey, { title: string; blurb: string }>>({
  en: {
    lir: {
      title: "Liberia Airport (LIR) ↔ Guanacaste and beyond",
      blurb:
        "Airport pickups and drop-offs at Daniel Oduber Quirós International Airport. The price is the same in both directions unless a return fare is shown under the route.",
    },
    sjo: {
      title: "San José Airport (SJO) ↔ Guanacaste and the rest of Costa Rica",
      blurb:
        "Pickups and drop-offs at Juan Santamaría International Airport. Same fixed price each way unless a return fare is shown.",
    },
    between: {
      title: "Between beaches, towns and destinations",
      blurb:
        "Point-to-point private transfers: beach to beach in Guanacaste, and Guanacaste to La Fortuna, Monteverde, Manuel Antonio and San José. Same fixed price each way unless a return fare is shown.",
    },
  },
  es: {
    lir: {
      title: "Aeropuerto de Liberia (LIR) ↔ Guanacaste y más allá",
      blurb:
        "Recogidas y entregas en el Aeropuerto Internacional Daniel Oduber Quirós. El precio es el mismo en ambos sentidos salvo que se muestre una tarifa de regreso bajo la ruta.",
    },
    sjo: {
      title: "Aeropuerto de San José (SJO) ↔ Guanacaste y el resto de Costa Rica",
      blurb:
        "Recogidas y entregas en el Aeropuerto Internacional Juan Santamaría. Mismo precio fijo en cada sentido salvo que se muestre una tarifa de regreso.",
    },
    between: {
      title: "Entre playas, pueblos y destinos",
      blurb:
        "Traslados privados punto a punto: de playa a playa en Guanacaste, y de Guanacaste a La Fortuna, Monteverde, Manuel Antonio y San José. Mismo precio fijo en cada sentido salvo que se muestre una tarifa de regreso.",
    },
  },
});

function samePrices(a: Route, b: Route): boolean {
  return (
    a.precio1a5 === b.precio1a5 &&
    a.precio6a9 === b.precio6a9 &&
    a.precio10a12 === b.precio10a12
  );
}

function pairGroupOf(route: Route): PairGroupKey {
  if (LIR.test(route.origen) || LIR.test(route.destino)) return "lir";
  if (SJO.test(route.origen) || SJO.test(route.destino)) return "sjo";
  return "between";
}

/**
 * The same routes as `groupRoutesForPriceList`, but each origin/destination
 * pair appears once. A→B and B→A are almost always the same fare, so listing
 * both doubled the page for no information; when the return fare differs
 * it is kept on the pair as `back` and rendered as a second line.
 *
 * Which direction is "out": the airport-origin one for airport groups, the
 * alphabetically first origin otherwise.
 */
export function pairRoutesForPriceList(
  routes: Route[],
  opts: { indexableOnly?: boolean; destinations?: DestinationMap; locale?: Locale } = {}
): PairGroup[] {
  const oneWay = groupRoutesForPriceList(routes, opts).flatMap((g) => g.routes);
  const byKey = new Map<string, Route>();
  for (const r of oneWay) byKey.set(`${r.origen}|${r.destino}`, r);

  const isAirport = (name: string) => LIR.test(name) || SJO.test(name);
  const seen = new Set<string>();
  const pairs: RoutePair[] = [];
  for (const r of oneWay) {
    const key = [r.origen, r.destino].sort().join("|");
    if (seen.has(key)) continue;
    seen.add(key);
    const reverse = byKey.get(`${r.destino}|${r.origen}`) ?? null;
    // Canonical direction: the airport is the origin when exactly one end is
    // an airport; otherwise (two airports, or none) the alphabetically first
    // name is the origin, so LIR ↔ SJO reads from Liberia.
    let out = r;
    if (reverse) {
      const rIsOut =
        isAirport(r.origen) && !isAirport(r.destino)
          ? true
          : isAirport(r.destino) && !isAirport(r.origen)
            ? false
            : r.origen.localeCompare(r.destino) <= 0;
      out = rIsOut ? r : reverse;
    }
    const back = reverse ? (out === r ? reverse : r) : null;
    pairs.push({ out, back: back && !samePrices(out, back) ? back : null });
  }

  const order: PairGroupKey[] = ["lir", "sjo", "between"];
  return order
    .map((key) => {
      const members = pairs.filter((p) => pairGroupOf(p.out) === key);
      members.sort((a, b) =>
        key === "between" ? byName(a.out, b.out) : byPriceThenName(a.out, b.out)
      );
      return { key, ...PAIR_META_COPY[opts.locale ?? "en"][key], pairs: members };
    })
    .filter((g) => g.pairs.length > 0);
}
