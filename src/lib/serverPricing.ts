import type { TripItem } from "@/lib/booking";
import { getRoutes, type Route } from "@/lib/routes";
import { getTier, isVehicleKey } from "@/lib/vehicles";

/**
 * Re-price a cart on the server before any money moves.
 *
 * The browser builds each TripItem from a route page, so `from` / `to` are the
 * route's `origen` / `destino` verbatim and `vehicleKey` picks the tier. The
 * price the browser sends is only ever used for display; the amount we charge
 * is looked up again here in the shared `routes` table.
 */
export type RepriceResult =
  | { ok: true; trips: TripItem[]; total: number; adjusted: boolean }
  | { ok: false; error: string };

function norm(s: string): string {
  return s.trim().toLowerCase();
}

function findRoute(routes: Route[], from: string, to: string): Route | undefined {
  const f = norm(from);
  const t = norm(to);
  return routes.find((r) => norm(r.origen) === f && norm(r.destino) === t);
}

export async function repriceTrips(trips: TripItem[]): Promise<RepriceResult> {
  const routes = await getRoutes();
  if (routes.length === 0) {
    return { ok: false, error: "Price list unavailable right now. Please try again in a moment." };
  }

  const repriced: TripItem[] = [];
  let adjusted = false;

  for (const trip of trips) {
    const route = findRoute(routes, trip.from, trip.to);
    if (!route) {
      return { ok: false, error: `Route ${trip.from} → ${trip.to} is not available for online booking.` };
    }
    if (!isVehicleKey(trip.vehicleKey)) {
      return { ok: false, error: `Vehicle not available for ${trip.from} → ${trip.to}.` };
    }
    const tier = getTier(trip.vehicleKey);
    const price = route[tier.priceField];
    if (typeof price !== "number" || !Number.isFinite(price) || price <= 0) {
      return { ok: false, error: `${tier.name} is not offered on ${trip.from} → ${trip.to}.` };
    }
    if (Math.round(price * 100) !== Math.round(Number(trip.price) * 100)) adjusted = true;
    repriced.push({ ...trip, price, duracion: trip.duracion ?? route.duracion ?? null });
  }

  const total = Math.round(repriced.reduce((sum, t) => sum + t.price, 0) * 100) / 100;
  return { ok: true, trips: repriced, total, adjusted };
}
