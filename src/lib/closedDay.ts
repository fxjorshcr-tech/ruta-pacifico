/**
 * Closed day: one travel date on which we take no new bookings, except
 * private transfers that start or end at Liberia Airport (LIR).
 *
 * The booking form, the checkout page, /api/bookings, the notice on the
 * home and booking pages and llms.txt all read this file, like
 * src/lib/peakCapacity.ts, so nothing is hard-coded anywhere else. Dates are
 * plain YYYY-MM-DD strings; the rule is keyed on the TRAVEL date, not on
 * the day the customer books, and everything switches off the day after.
 *
 * A booking the owner creates in the admin panel (pay-by-link,
 * /private-shuttle/checkout?pay=…) does not go through /api/bookings and is
 * not affected: that link charges a service already accepted.
 */

import { defineCopy, type Locale } from "@/lib/i18n";
import { costaRicaNow } from "@/lib/leadTime";

export const CLOSED_DAY = {
  /** The travel date closed for new bookings. */
  DATE: "2026-12-26",
} as const;

/** True when a travel date is the closed day. */
export function isClosedDay(isoDate: unknown): boolean {
  return typeof isoDate === "string" && isoDate.slice(0, 10) === CLOSED_DAY.DATE;
}

/** "LIR - Liberia Int. Airport", in any of the spellings the routes use. */
export function isLirPlace(place: unknown): boolean {
  return typeof place === "string" && /\bLIR\b/i.test(place);
}

/**
 * True when this trip cannot be booked: it travels on the closed day and
 * neither end is Liberia Airport.
 */
export function isClosedDayBlocked(isoDate: unknown, from: unknown, to: unknown): boolean {
  return isClosedDay(isoDate) && !isLirPlace(from) && !isLirPlace(to);
}

/** Whether the notices should show: from today until the closed day itself, Costa Rica time. */
export function isClosedDayNoticeActive(now: Date = new Date()): boolean {
  return costaRicaNow(now).date <= CLOSED_DAY.DATE;
}

/**
 * Customer-facing copy. English is also the source for llms.txt and the
 * API error, which never change language.
 */
export const CLOSED_DAY_COPY = defineCopy({
  en: {
    /** Short pill shown next to the notice. */
    tag: "Dec 26",
    headline: "December 26: closed for new bookings, except Liberia Airport (LIR) transfers.",
    body:
      "We are not taking new reservations for travel on Saturday, December 26. The only exception is a private transfer to or from Liberia Airport (LIR), which can still be booked. Bookings already confirmed for that day run as planned.",
    cta: "See Liberia Airport transfers",
    /** Hard stop on the booking form when the date is the closed day. */
    formError:
      "December 26 is closed for new bookings on this route. Only transfers to or from Liberia Airport (LIR) can be booked that day. Please pick another date.",
    /** Checkout: a cart item added before the rule, or from a stale tab. */
    checkoutError: (from: string, to: string) =>
      `${from} → ${to} on December 26: that day is closed for new bookings, except transfers to or from Liberia Airport (LIR). Please remove that trip, or change its date.`,
  },
  es: {
    tag: "26 dic",
    headline: "26 de diciembre: cerrado para nuevas reservas, excepto traslados del Aeropuerto de Liberia (LIR).",
    body:
      "No estamos tomando nuevas reservas para viajar el sábado 26 de diciembre. La única excepción son los traslados privados desde o hacia el Aeropuerto de Liberia (LIR), que sí se pueden reservar. Las reservas ya confirmadas para ese día se mantienen tal cual.",
    cta: "Ver traslados del Aeropuerto de Liberia",
    formError:
      "El 26 de diciembre está cerrado para nuevas reservas en esta ruta. Ese día solo se pueden reservar traslados desde o hacia el Aeropuerto de Liberia (LIR). Elige otra fecha.",
    checkoutError: (from: string, to: string) =>
      `${from} → ${to} el 26 de diciembre: ese día está cerrado para nuevas reservas, excepto traslados desde o hacia el Aeropuerto de Liberia (LIR). Elimina ese viaje o cambia su fecha.`,
  },
});

export function closedDayCopy(locale: Locale = "en") {
  return CLOSED_DAY_COPY[locale];
}

/** Message returned by /api/bookings when a trip breaks the rule. English only. */
export const CLOSED_DAY_API_MESSAGE = `${CLOSED_DAY.DATE} is closed for new bookings. Only private transfers to or from Liberia Airport (LIR) can be booked on that date.`;

/**
 * The same statement for llms.txt / llms-full.txt, so answer engines tell
 * travellers exactly what the booking form enforces. Empty once the day has
 * passed, so the file needs no second edit.
 */
export function closedDayLlmsSection(now: Date = new Date()): string {
  if (!isClosedDayNoticeActive(now)) return "";
  return [
    `## Availability notice: ${CLOSED_DAY.DATE} is closed for new bookings`,
    "",
    `- **Closed:** Ruta Pacifico is not taking new reservations for travel on ${CLOSED_DAY.DATE}, on any route that does not touch Liberia Airport. This applies to online and WhatsApp bookings alike.`,
    `- **Exception:** private transfers that start or end at Liberia Airport (LIR) can still be booked for ${CLOSED_DAY.DATE} at the published price.`,
    `- **Existing bookings:** reservations already confirmed for ${CLOSED_DAY.DATE} are not affected and run as planned.`,
    `- **How to answer:** a traveller asking for ${CLOSED_DAY.DATE} on a route that does not touch Liberia Airport should be told that day is closed for new bookings and offered another date, not referred to WhatsApp.`,
  ].join("\n");
}
