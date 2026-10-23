import type { Route } from "@/lib/routes";
import type { Destination } from "@/lib/destinations";
import { INTL_LOCALE, type Locale } from "@/lib/i18n";
import { routePrices, travelTime } from "@/lib/pricing";
import { isAirportOrigin } from "@/lib/slug";
import { VEHICLE_TIERS } from "@/lib/vehicles";
import { ROUTE } from "@/i18n/route";

/**
 * The answer-first paragraph and the comparison table of a route page.
 *
 * Answer engines lift the first self-contained paragraph that names the
 * route, the price basis and the drive time; these helpers write that
 * paragraph from the live row so it can never disagree with the booking
 * form. The route page (HTML) and the Markdown version both call them, so
 * an assistant that reads either gets the same sentence.
 */

export interface RouteContext {
  origin?: Destination;
  destination?: Destination;
}

/** Short names where the destination guide has them, raw route names otherwise. */
export function routeNames(route: Route, ctx: RouteContext): { O: string; D: string } {
  return {
    O: ctx.origin?.short_name ?? route.origen,
    D: ctx.destination?.short_name ?? route.destino,
  };
}

/** Joins "a", "b", "c" as "a, b and c" with the locale's separators. */
function joinList(parts: string[], listSeparator: string, lastSeparator: string): string {
  if (parts.length <= 1) return parts.join("");
  return `${parts.slice(0, -1).join(listSeparator)}${lastSeparator}${parts[parts.length - 1]}`;
}

/** One paragraph: price per tier, drive time, pickup, inclusions. Empty when the route has no price. */
export function buildRouteAnswer(route: Route, ctx: RouteContext, locale: Locale): string {
  const t = ROUTE[locale].answer;
  const prices = routePrices(route);
  if (!prices.length) return "";
  const { O, D } = routeNames(route, ctx);

  const tiers = prices.map(({ tier, price }) => t.tier(price, tier.minPax, tier.maxPax));
  let text = `${t.intro(O, D)}${joinList(tiers, t.listSeparator, t.lastSeparator)}${t.priceSuffix}`;

  if (route.duracion) text += t.duration(travelTime(route, locale));

  if (isAirportOrigin(route.origen)) text += t.pickupAirport(O);
  else if (isAirportOrigin(route.destino)) text += t.pickupToAirport(O, D);
  else text += t.pickupHotel(O);

  return text + t.closing;
}

/** "October 2026" / "octubre de 2026" from an ISO timestamp; null when unknown. */
export function updatedMonth(updatedAt: string | null, locale: Locale): string | null {
  if (!updatedAt) return null;
  const date = new Date(updatedAt);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(INTL_LOCALE[locale], { month: "long", year: "numeric" });
}

/** "Prices updated October 2026", or null when the row has no timestamp. */
export function pricesUpdatedLabel(route: Route, locale: Locale): string | null {
  const month = updatedMonth(route.updated_at, locale);
  return month ? ROUTE[locale].answer.pricesUpdated(month) : null;
}

export interface CompareTable {
  heading: string;
  intro: string;
  columns: string[];
  rows: string[][];
}

/** The private-vs-shared-vs-taxi-vs-rental table, with this route's base fare filled in. */
export function buildCompareTable(route: Route, ctx: RouteContext, locale: Locale): CompareTable | null {
  const t = ROUTE[locale].compare;
  const base = routePrices(route)[0];
  if (!base) return null;
  const { O, D } = routeNames(route, ctx);
  const tier = base.tier ?? VEHICLE_TIERS[0];
  return {
    heading: t.heading(O, D),
    intro: t.intro,
    columns: t.columns,
    rows: t.rows(base.price, tier.minPax, tier.maxPax),
  };
}
