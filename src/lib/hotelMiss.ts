"use client";

/**
 * Report a location search that returned zero results, so we learn which
 * hotels to add to `hotels.ts`. Each miss is a guest who could not find where
 * they are staying — a booking we probably lost.
 *
 * Deliberately cheap: de-duplicated per browser session, fire-and-forget
 * (sendBeacon when available), never blocks or throws into the UI. The
 * combobox already debounces and filters trivial queries before calling.
 */

const sessionLogged = new Set<string>();

export function logHotelMiss(query: string): void {
  const q = query.trim();
  const key = q.toLowerCase();
  if (!q || sessionLogged.has(key)) return;
  sessionLogged.add(key);

  try {
    const body = JSON.stringify({ query: q });
    if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
      navigator.sendBeacon(
        "/api/hotel-miss",
        new Blob([body], { type: "application/json" })
      );
      return;
    }
    fetch("/api/hotel-miss", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // best-effort telemetry — ignore
  }
}
