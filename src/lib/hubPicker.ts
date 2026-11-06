import type { Route } from "@/lib/routes";
import { destinationFor, type DestinationMap } from "@/lib/destinations";
import { travelTime } from "@/lib/pricing";
import { routeSlug } from "@/lib/slug";
import { VEHICLE_TIERS } from "@/lib/vehicles";
import type { Locale } from "@/lib/i18n";

/**
 * The data behind the hub route picker (src/components/HubRoutePicker.tsx):
 * every priced route of a hub reduced to what the picker shows, so the
 * client component ships a few KB of plain strings and numbers instead of
 * the Route rows and the destinations map.
 */
export interface PickerRoute {
  id: number;
  /** "from": the route leaves the hub place; "to": it arrives there. */
  direction: "from" | "to";
  /** Short name of the other end of the route ("Tamarindo"). */
  other: string;
  /** Price per vehicle, in VEHICLE_TIERS order; null when that size is not sold. */
  prices: (number | null)[];
  /** "about 50 minutes" in the page language, or "" when unknown. */
  time: string;
  /** Language-less path of the route page. */
  href: string;
}

function shortName(place: string, map: DestinationMap): string {
  return destinationFor(place, map)?.short_name ?? place;
}

function toPicker(route: Route, direction: "from" | "to", map: DestinationMap, locale: Locale): PickerRoute {
  return {
    id: route.id,
    direction,
    other: shortName(direction === "from" ? route.destino : route.origen, map),
    prices: VEHICLE_TIERS.map((tier) => {
      const p = route[tier.priceField];
      return typeof p === "number" && p > 0 ? p : null;
    }),
    time: route.duracion ? travelTime(route, locale) : "",
    href: `/private-shuttle/${routeSlug(route.origen, route.destino)}`,
  };
}

/**
 * Picker options for a hub: departures then arrivals, each list
 * alphabetical by the other end so a traveller finds their town on the
 * wheel without reading every price.
 */
export function pickerRoutes(
  departures: Route[],
  arrivals: Route[],
  map: DestinationMap,
  locale: Locale,
): PickerRoute[] {
  const byOther = (a: PickerRoute, b: PickerRoute) => a.other.localeCompare(b.other);
  return [
    ...departures.map((r) => toPicker(r, "from", map, locale)).sort(byOther),
    ...arrivals.map((r) => toPicker(r, "to", map, locale)).sort(byOther),
  ];
}
