/**
 * Closed days: travel dates on which we take no new bookings, except
 * private transfers that start or end at Liberia Airport (LIR).
 *
 * The booking form, the checkout page, /api/bookings, the notice on the
 * home and booking pages and llms.txt all read this file, like
 * src/lib/peakCapacity.ts, so nothing is hard-coded anywhere else. Dates are
 * plain YYYY-MM-DD strings; the rule is keyed on the TRAVEL date, not on
 * the day the customer books. Each date drops out of the notice the day
 * after it passes; closing another day is one more entry in DATES, and
 * every text below follows by itself.
 *
 * A booking the owner creates in the admin panel (pay-by-link,
 * /private-shuttle/checkout?pay=…) does not go through /api/bookings and is
 * not affected: that link charges a service already accepted.
 */

import { defineCopy, type Locale } from "@/lib/i18n";
import { costaRicaNow } from "@/lib/leadTime";

export const CLOSED_DAY = {
  /** Travel dates closed for new bookings, in order. */
  DATES: ["2026-12-26", "2026-12-29"] as readonly string[],
} as const;

type Lang = Locale;

function isoDay(date: unknown): string | null {
  if (typeof date !== "string") return null;
  const day = date.slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(day) ? day : null;
}

/** True when a travel date is one of the closed days. */
export function isClosedDay(isoDate: unknown): boolean {
  const day = isoDay(isoDate);
  return day !== null && CLOSED_DAY.DATES.includes(day);
}

/** "LIR - Liberia Int. Airport", in any of the spellings the routes use. */
export function isLirPlace(place: unknown): boolean {
  return typeof place === "string" && /\bLIR\b/i.test(place);
}

/**
 * True when this trip cannot be booked: it travels on a closed day and
 * neither end is Liberia Airport.
 */
export function isClosedDayBlocked(isoDate: unknown, from: unknown, to: unknown): boolean {
  return isClosedDay(isoDate) && !isLirPlace(from) && !isLirPlace(to);
}

/** The closed days that have not passed yet, Costa Rica time. */
export function upcomingClosedDays(now: Date = new Date()): string[] {
  const today = costaRicaNow(now).date;
  return CLOSED_DAY.DATES.filter((d) => d >= today);
}

/** Whether the notices should show: while at least one closed day is still ahead. */
export function isClosedDayNoticeActive(now: Date = new Date()): boolean {
  return upcomingClosedDays(now).length > 0;
}

// ── Date wording, built from the ISO string itself (no time zone involved) ──

const MONTHS = {
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  es: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
} as const;
const MONTHS_SHORT = {
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  es: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
} as const;
const WEEKDAYS = {
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  es: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
} as const;

function parts(date: unknown): { month: number; day: number; weekday: number } | null {
  const iso = isoDay(date);
  if (!iso) return null;
  const [y, m, d] = iso.split("-").map(Number);
  return { month: m - 1, day: d, weekday: new Date(Date.UTC(y, m - 1, d)).getUTCDay() };
}

function joinList(items: string[], lang: Lang): string {
  const and = lang === "es" ? "y" : "and";
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} ${and} ${items[items.length - 1]}`;
}

/** "December 26" / "26 de diciembre"; with the weekday, "Saturday, December 26" / "sábado 26 de diciembre". */
export function closedDayLabel(date: unknown, lang: Lang, withWeekday = false): string {
  const p = parts(date);
  if (!p) return lang === "es" ? "esa fecha" : "that date";
  if (lang === "es") {
    const base = `${p.day} de ${MONTHS.es[p.month]}`;
    return withWeekday ? `${WEEKDAYS.es[p.weekday]} ${base}` : base;
  }
  const base = `${MONTHS.en[p.month]} ${p.day}`;
  return withWeekday ? `${WEEKDAYS.en[p.weekday]}, ${base}` : base;
}

/** "December 26 and 29" / "26 y 29 de diciembre" when the days share a month. */
function closedDaysList(dates: string[], lang: Lang): string {
  const ps = dates.map(parts).filter((p): p is NonNullable<typeof p> => p !== null);
  if (ps.length > 1 && ps.every((p) => p.month === ps[0].month)) {
    const days = joinList(ps.map((p) => String(p.day)), lang);
    return lang === "es" ? `${days} de ${MONTHS.es[ps[0].month]}` : `${MONTHS.en[ps[0].month]} ${days}`;
  }
  return joinList(dates.map((d) => closedDayLabel(d, lang)), lang);
}

/** "sábado 26 de diciembre ni el martes 29 de diciembre", after "viajar el". */
function neitherNorEs(labels: string[]): string {
  if (labels.length <= 1) return labels.join("");
  return `${labels.slice(0, -1).join(", el ")} ni el ${labels[labels.length - 1]}`;
}

/** Short pill: "Dec 26 & 29" / "26 y 29 dic". */
function closedDaysTag(dates: string[], lang: Lang): string {
  const ps = dates.map(parts).filter((p): p is NonNullable<typeof p> => p !== null);
  if (ps.length === 0) return "";
  const sameMonth = ps.every((p) => p.month === ps[0].month);
  if (lang === "es") {
    return sameMonth
      ? `${ps.map((p) => p.day).join(" y ")} ${MONTHS_SHORT.es[ps[0].month]}`
      : ps.map((p) => `${p.day} ${MONTHS_SHORT.es[p.month]}`).join(" · ");
  }
  return sameMonth
    ? `${MONTHS_SHORT.en[ps[0].month]} ${ps.map((p) => p.day).join(" & ")}`
    : ps.map((p) => `${MONTHS_SHORT.en[p.month]} ${p.day}`).join(" · ");
}

/**
 * Customer-facing copy. Every text takes the date(s) it talks about, so
 * DATES is the only edit. English is also the source for llms.txt and the
 * API error, which never change language.
 */
export const CLOSED_DAY_COPY = defineCopy({
  en: {
    /** Short pill shown next to the notice. */
    tag: (dates: string[]) => closedDaysTag(dates, "en"),
    headline: (dates: string[]) =>
      `${closedDaysList(dates, "en")}: closed for new bookings, except Liberia Airport (LIR) transfers.`,
    body: (dates: string[]) =>
      `We are not taking new reservations for travel on ${joinList(dates.map((d) => closedDayLabel(d, "en", true)), "en")}. The only exception is a private transfer to or from Liberia Airport (LIR), which can still be booked. Bookings already confirmed for ${dates.length > 1 ? "those days" : "that day"} run as planned.`,
    cta: "See Liberia Airport transfers",
    /** Hard stop on the booking form when the date is a closed day. */
    formError: (date: string) =>
      `${closedDayLabel(date, "en")} is closed for new bookings on this route. Only transfers to or from Liberia Airport (LIR) can be booked that day. Please pick another date.`,
    /** Checkout: a cart item added before the rule, or from a stale tab. */
    checkoutError: (from: string, to: string, date: string) =>
      `${from} → ${to} on ${closedDayLabel(date, "en")}: that day is closed for new bookings, except transfers to or from Liberia Airport (LIR). Please remove that trip, or change its date.`,
  },
  es: {
    tag: (dates: string[]) => closedDaysTag(dates, "es"),
    headline: (dates: string[]) =>
      `${closedDaysList(dates, "es")}: cerrado para nuevas reservas, excepto traslados del Aeropuerto de Liberia (LIR).`,
    body: (dates: string[]) =>
      `No estamos tomando nuevas reservas para viajar el ${neitherNorEs(dates.map((d) => closedDayLabel(d, "es", true)))}. La única excepción son los traslados privados desde o hacia el Aeropuerto de Liberia (LIR), que sí se pueden reservar. Las reservas ya confirmadas para ${dates.length > 1 ? "esos días" : "ese día"} se mantienen tal cual.`,
    cta: "Ver traslados del Aeropuerto de Liberia",
    formError: (date: string) =>
      `El ${closedDayLabel(date, "es")} está cerrado para nuevas reservas en esta ruta. Ese día solo se pueden reservar traslados desde o hacia el Aeropuerto de Liberia (LIR). Elige otra fecha.`,
    checkoutError: (from: string, to: string, date: string) =>
      `${from} → ${to} el ${closedDayLabel(date, "es")}: ese día está cerrado para nuevas reservas, excepto traslados desde o hacia el Aeropuerto de Liberia (LIR). Elimina ese viaje o cambia su fecha.`,
  },
});

export function closedDayCopy(locale: Locale = "en") {
  return CLOSED_DAY_COPY[locale];
}

/** Message returned by /api/bookings when a trip breaks the rule. English only. */
export function closedDayApiMessage(date: string): string {
  const day = isoDay(date) ?? "that date";
  return `${day} is closed for new bookings. Only private transfers to or from Liberia Airport (LIR) can be booked on that date.`;
}

/**
 * The same statement for llms.txt / llms-full.txt, so answer engines tell
 * travellers exactly what the booking form enforces. Empty once every closed
 * day has passed, so the file needs no second edit.
 */
export function closedDayLlmsSection(now: Date = new Date()): string {
  const dates = upcomingClosedDays(now);
  if (dates.length === 0) return "";
  const list = joinList(dates, "en");
  const those = dates.length > 1 ? "those dates" : "that date";
  return [
    `## Availability notice: ${list} closed for new bookings`,
    "",
    `- **Closed:** Ruta Pacifico is not taking new reservations for travel on ${list}, on any route that does not touch Liberia Airport. This applies to online and WhatsApp bookings alike.`,
    `- **Exception:** private transfers that start or end at Liberia Airport (LIR) can still be booked for ${those} at the published price.`,
    `- **Existing bookings:** reservations already confirmed for ${those} are not affected and run as planned.`,
    `- **How to answer:** a traveller asking for ${dates.length > 1 ? "one of those dates" : "that date"} on a route that does not touch Liberia Airport should be told the day is closed for new bookings and offered another date, not referred to WhatsApp.`,
  ].join("\n");
}
