/**
 * Booking lead-time rule (shared by the date picker, the checkout page and
 * the /api/bookings route so the server enforces exactly what the UI shows).
 *
 * Same-day pickups are never accepted. The earliest pickup date depends on
 * the time of day in Costa Rica:
 *   - before the cutoff (12:00 PM CR time) → tomorrow
 *   - at or after the cutoff              → the day after tomorrow
 *
 * Costa Rica is UTC-6 all year (no daylight saving), so the local date and
 * hour can be derived by a fixed offset without Intl time-zone support.
 */

import { defineCopy, type Locale } from "@/lib/i18n";

export const LEAD_TIME_CUTOFF_HOUR = 12; // noon, Costa Rica time
const CR_UTC_OFFSET_MINUTES = -6 * 60;

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** Costa Rica local date (YYYY-MM-DD) and hour for the given instant. */
export function costaRicaNow(now: Date = new Date()): {
  date: string;
  hour: number;
} {
  const shifted = new Date(now.getTime() + CR_UTC_OFFSET_MINUTES * 60_000);
  const date = `${shifted.getUTCFullYear()}-${pad(shifted.getUTCMonth() + 1)}-${pad(shifted.getUTCDate())}`;
  return { date, hour: shifted.getUTCHours() };
}

/** Add whole days to a YYYY-MM-DD string (calendar arithmetic, no TZ). */
export function addDays(isoDate: string, days: number): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  const t = Date.UTC(y, m - 1, d + days);
  const r = new Date(t);
  return `${r.getUTCFullYear()}-${pad(r.getUTCMonth() + 1)}-${pad(r.getUTCDate())}`;
}

/** Earliest pickup date (YYYY-MM-DD) a customer may book right now. */
export function earliestPickupDate(now: Date = new Date()): string {
  const cr = costaRicaNow(now);
  const daysAhead = cr.hour < LEAD_TIME_CUTOFF_HOUR ? 1 : 2;
  return addDays(cr.date, daysAhead);
}

/** True when the pickup date satisfies the lead-time rule. ISO strings compare lexicographically. */
export function isPickupDateAllowed(isoDate: string, now: Date = new Date()): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(isoDate) && isoDate >= earliestPickupDate(now);
}

/** Customer-facing explanation of the rule, used wherever a date is rejected. */
export const LEAD_TIME_MESSAGE =
  "We need at least one day's notice. Book before 12:00 PM (Costa Rica time) to travel tomorrow; after that, the earliest pickup is the day after tomorrow.";

/** The same rule in both languages; `LEAD_TIME_MESSAGE` stays the English source. */
export const LEAD_TIME_COPY = defineCopy({
  en: { message: LEAD_TIME_MESSAGE },
  es: {
    message:
      "Necesitamos al menos un día de anticipación. Reserva antes de las 12:00 p. m. (hora de Costa Rica) para viajar mañana; después de esa hora, la recogida más cercana es pasado mañana.",
  },
});

/** Customer-facing lead-time explanation in the visitor's language. */
export function leadTimeMessage(locale: Locale = "en"): string {
  return LEAD_TIME_COPY[locale].message;
}
