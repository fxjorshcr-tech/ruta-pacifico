import type { Locale } from "@/lib/i18n";

/**
 * Minutes → the drive-time phrase the site shows: "about 1 hour 30 minutes"
 * / "aprox. 1 hora 30 minutos". Pure, so it runs in the browser (the place
 * finder on /destinations) and on the server (`travelTime` in pricing.ts)
 * and both print the same string for the same route.
 */
export function formatTravelMinutes(minutes: number, locale: Locale = "en"): string {
  const h = Math.floor(minutes / 60);
  const min = minutes % 60;
  if (locale === "es") {
    if (h === 0) return `aprox. ${min} minutos`;
    const hours = `${h} hora${h === 1 ? "" : "s"}`;
    return min ? `aprox. ${hours} ${min} minutos` : `aprox. ${hours}`;
  }
  if (h === 0) return `about ${min} minutes`;
  const hours = `${h} hour${h === 1 ? "" : "s"}`;
  return min ? `about ${hours} ${min} minutes` : `about ${hours}`;
}
