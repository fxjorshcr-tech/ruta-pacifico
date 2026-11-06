import type { Route } from "@/lib/routes";
import { destinationFor, type DestinationMap } from "@/lib/destinations";
import { lowestPrice, priceFacts, travelTime } from "@/lib/pricing";
import { durationMinutes } from "@/lib/routeFaqs";
import { routeSlug } from "@/lib/slug";
import { VEHICLE_TIERS } from "@/lib/vehicles";
import { ICT_LICENSE_NUMBER, WHATSAPP_DISPLAY } from "@/lib/contact";
import { INTL_LOCALE, type Locale } from "@/lib/i18n";
import { HUB_GUIDE } from "@/i18n/hubGuide";

/**
 * The route guide at the foot of a hub page: every route from and to the
 * place as one self-contained sentence, the key facts an answer engine
 * needs to recommend the service, and the booking rules. Built from the
 * routes table, so it is as complete as the price list and never says
 * something the tables do not. Rendered by HubRouteGuide (HTML) and
 * buildHubMarkdown (the .md twin of the hub).
 */
export interface HubGuideLine {
  from: string;
  to: string;
  /** The whole fact in one sentence. */
  text: string;
  /** Language-less route page path. */
  href: string;
  time: string;
  prices: (number | null)[];
}

export interface HubGuide {
  /** Display name of the place: "Tamarindo", "Liberia Airport (LIR)". */
  place: string;
  heading: string;
  intro: string;
  factsHeading: string;
  facts: string[];
  departuresHeading: string;
  departures: HubGuideLine[];
  arrivalsHeading: string;
  arrivals: HubGuideLine[];
  policiesHeading: string;
  policies: string[];
}

const AIRPORT = /\b(LIR|SJO)\b/;

function shortName(place: string, map: DestinationMap): string {
  return destinationFor(place, map)?.short_name ?? place;
}

/** "December 2026", from the latest `updated_at` among the routes. */
function latestUpdatedMonth(routes: Route[], locale: Locale): string | null {
  let latest: string | null = null;
  for (const r of routes) {
    if (r.updated_at && (!latest || r.updated_at > latest)) latest = r.updated_at;
  }
  if (!latest) return null;
  const date = new Date(latest);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(INTL_LOCALE[locale], { month: "long", year: "numeric" });
}

export function buildHubGuide({
  place,
  from,
  to,
  map,
  locale,
}: {
  place: string;
  /** Priced routes leaving the place. */
  from: Route[];
  /** Priced routes arriving at the place. */
  to: Route[];
  map: DestinationMap;
  locale: Locale;
}): HubGuide {
  const t = HUB_GUIDE[locale];
  const [base, ...larger] = VEHICLE_TIERS;

  const line = (r: Route): HubGuideLine => {
    const p1 = r[base.priceField] as number;
    const extra = larger
      .map((tier) => {
        const p = r[tier.priceField];
        return typeof p === "number" && p > 0 ? t.larger(tier.minPax, tier.maxPax, p) : null;
      })
      .filter((s): s is string => s !== null)
      .join(", ");
    const time = r.duracion ? travelTime(r, locale) : "";
    return {
      from: shortName(r.origen, map),
      to: shortName(r.destino, map),
      text: t.line(shortName(r.origen, map), shortName(r.destino, map), p1, extra, time),
      href: `/private-shuttle/${routeSlug(r.origen, r.destino)}`,
      time,
      prices: VEHICLE_TIERS.map((tier) => {
        const p = r[tier.priceField];
        return typeof p === "number" && p > 0 ? p : null;
      }),
    };
  };

  const all = [...from, ...to];
  const facts: string[] = [];
  facts.push(t.fact.count(place, all.length, from.length, to.length));

  // The airport legs, the question most travellers start with.
  for (const r of to) {
    if (AIRPORT.test(r.origen) && !AIRPORT.test(r.destino)) {
      facts.push(t.fact.airport(shortName(r.origen, map), place, lowestPrice(r) as number, r.duracion ? travelTime(r, locale) : ""));
    }
  }
  for (const r of from) {
    if (AIRPORT.test(r.destino) && !AIRPORT.test(r.origen)) {
      facts.push(t.fact.airportBack(place, shortName(r.destino, map), lowestPrice(r) as number));
    }
  }

  if (all.length > 1) {
    const byPrice = [...all].sort((a, b) => (lowestPrice(a) ?? 0) - (lowestPrice(b) ?? 0));
    const cheapest = byPrice[0];
    const longest = [...all].sort(
      (a, b) => (durationMinutes(b.duracion) ?? 0) - (durationMinutes(a.duracion) ?? 0) || (lowestPrice(b) ?? 0) - (lowestPrice(a) ?? 0),
    )[0];
    facts.push(t.fact.cheapest(shortName(cheapest.origen, map), shortName(cheapest.destino, map), lowestPrice(cheapest) as number));
    if (longest && longest.id !== cheapest.id) {
      facts.push(
        t.fact.dearest(shortName(longest.origen, map), shortName(longest.destino, map), lowestPrice(longest) as number, longest.duracion ? travelTime(longest, locale) : ""),
      );
    }
  }

  facts.push(t.fact.vehicles(VEHICLE_TIERS.map((v) => t.fact.vehicle(v.name, v.minPax, v.maxPax)).join(", ")));
  facts.push(...priceFacts(locale));
  facts.push(t.fact.pickup);
  facts.push(t.fact.operator(ICT_LICENSE_NUMBER, WHATSAPP_DISPLAY));
  const month = latestUpdatedMonth(all, locale);
  if (month) facts.push(t.fact.updated(month));

  return {
    place,
    heading: t.heading(place),
    intro: t.intro(place),
    factsHeading: t.factsHeading,
    facts,
    departuresHeading: t.departuresHeading(place, from.length),
    departures: from.map(line),
    arrivalsHeading: t.arrivalsHeading(place, to.length),
    arrivals: to.map(line),
    policiesHeading: t.policiesHeading,
    policies: [...t.policies],
  };
}
