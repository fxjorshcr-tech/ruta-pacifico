import type { Route } from "@/lib/routes";
import type { Destination } from "@/lib/destinations";
import { isAirportOrigin } from "@/lib/slug";
import { VEHICLE_TIERS } from "@/lib/vehicles";

/**
 * Route-specific questions and answers, generated from the data we already
 * hold (duration, per-tier prices, airport at either end). These are the
 * questions travellers put to search engines and AI assistants before they
 * book ("how long", "how much", "where does the driver meet me", "child
 * seats", "delayed flight"). Rendered collapsed on the route page and
 * emitted as FAQPage JSON-LD so answer engines can quote them directly.
 *
 * Answers are plain text (no Markdown) so the same string works in HTML and
 * in JSON-LD.
 */
export interface RouteFaq {
  q: string;
  a: string;
}

/** Parse the free-form `duracion` column ("4,5 H", "45 min", "1h 30min") to minutes. */
export function durationMinutes(raw: string | null | undefined): number | null {
  if (!raw) return null;
  const s = raw.trim().toLowerCase().replace(",", ".");
  let m = s.match(/^(\d+(?:\.\d+)?)\s*h(?:ours?)?(?:\s*(\d+)\s*min)?$/);
  if (m) {
    const hours = parseFloat(m[1]);
    const extra = m[2] ? parseInt(m[2], 10) : 0;
    // "1.15 H" in this dataset means 1 h 15 min, not 1.15 h.
    const frac = hours - Math.floor(hours);
    const fracMinutes =
      frac > 0 && Math.abs(frac - 0.5) > 0.01 ? Math.round(frac * 100) : Math.round(frac * 60);
    return Math.floor(hours) * 60 + fracMinutes + extra;
  }
  m = s.match(/^(\d+)\s*min/);
  if (m) return parseInt(m[1], 10);
  return null;
}

/** "about 1 hour 30 minutes", "about 45 minutes". */
export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const min = minutes % 60;
  if (h === 0) return `about ${min} minutes`;
  const hours = `${h} hour${h === 1 ? "" : "s"}`;
  return min ? `about ${hours} ${min} minutes` : `about ${hours}`;
}

function priceSentence(route: Route): string {
  const parts: string[] = [];
  for (const tier of VEHICLE_TIERS) {
    const price = route[tier.priceField];
    if (typeof price === "number" && price > 0) {
      parts.push(`$${price} for ${tier.minPax} to ${tier.maxPax} passengers`);
    }
  }
  if (!parts.length) return "";
  if (parts.length === 1) return `${parts[0]}, per vehicle.`;
  return `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}, per vehicle.`;
}

interface Context {
  origin?: Destination;
  destination?: Destination;
}

export function buildRouteFaqs(route: Route, ctx: Context = {}): RouteFaq[] {
  const O = ctx.origin?.short_name ?? route.origen;
  const D = ctx.destination?.short_name ?? route.destino;
  const airportPickup = isAirportOrigin(route.origen);
  const airportDropoff = isAirportOrigin(route.destino);
  const minutes = durationMinutes(route.duracion);
  const faqs: RouteFaq[] = [];

  // 1. Duration
  faqs.push({
    q: `How long does the private shuttle from ${O} to ${D} take?`,
    a: minutes
      ? `${formatDuration(minutes).replace(/^about/, "About")} door to door. That is a realistic figure for Costa Rican roads, not the fastest time a map app shows. The service is direct, with no other passengers, so there are no detours to drop anyone else off.`
      : `The driving time depends on your exact pickup and drop-off points in ${O} and ${D}; we confirm it with your quote. The service is direct, with no other passengers and no detours.`,
  });

  // 2. Price
  const prices = priceSentence(route);
  faqs.push({
    q: `How much does a private shuttle from ${O} to ${D} cost?`,
    a: prices
      ? `${prices} The price is per vehicle, not per person, and includes the driver, fuel, tolls and 13% VAT. There is nothing to pay at pickup.`
      : `Prices are per vehicle, not per person, and include the driver, fuel, tolls and 13% VAT. Search the route on the booking page to see the exact figure for your group size.`,
  });

  // 3. Meeting point
  if (airportPickup) {
    faqs.push({
      q: `Where does the driver meet me at ${O}?`,
      a: `At the arrivals exit, holding a sign with the lead passenger's name. We track your flight, so if it lands early or late the pickup moves with it at no charge. From the exit to the vehicle is a short walk.`,
    });
  } else if (airportDropoff) {
    const lead = minutes ? minutes + 180 : null;
    faqs.push({
      q: `What time should I leave ${O} for a flight from ${D}?`,
      a: lead
        ? `We schedule the pickup so you reach ${D} about 3 hours before an international departure, which means leaving ${O} roughly ${formatDuration(lead).replace(/^about /, "")} before your flight. If you prefer a different margin, tell us when booking.`
        : `We schedule the pickup so you reach ${D} about 3 hours before an international departure. Give us the flight time when booking and we set the departure from ${O} accordingly.`,
    });
  } else {
    faqs.push({
      q: `Where does the driver pick me up in ${O}?`,
      a: `At the door of your hotel, villa or rental in ${O}, at the time you choose. Give us the property name or a map pin when you book and the driver comes to the entrance.`,
    });
  }

  // 4. Stops
  faqs.push({
    q: `Can we stop along the way from ${O} to ${D}?`,
    a: `Yes. Short stops for food, a supermarket, an ATM or photos are part of the service. Longer detours, such as a waterfall or a second town, are quoted in advance so there are no surprises.`,
  });

  // 5. Child seats
  faqs.push({
    q: `Do you have child seats for the trip to ${D}?`,
    a: `Yes, and they are free. Costa Rican law requires a car seat or booster for children under 12 or shorter than 1.45 m (4 ft 9 in), so tell us the ages when you book and the right seats are installed before pickup.`,
  });

  // 6. Delays / night travel
  if (airportPickup) {
    faqs.push({
      q: `What happens if my flight into ${O} is delayed?`,
      a: `Nothing changes for you. We follow the flight number you give us and adjust the pickup to the actual landing time. There is no waiting charge for delays, and the same driver meets you.`,
    });
  } else {
    faqs.push({
      q: `Can I travel from ${O} to ${D} at night or very early?`,
      a: `Yes. We run 24 hours a day, every day of the year, with no night surcharge. Early departures for morning flights and late arrivals are routine.`,
    });
  }

  // 7. Cancellation
  faqs.push({
    q: `What is the cancellation policy for this shuttle?`,
    a: `Cancel more than 48 hours before pickup for a full refund minus the 13% tax. Within 48 hours the trip is non-refundable. Changes to date, time or address are free up to 48 hours before, subject to availability.`,
  });

  return faqs;
}
