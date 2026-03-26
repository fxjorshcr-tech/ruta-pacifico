"use client";

import { useState, useMemo } from "react";

export interface Route {
  id: number;
  origen: string;
  destino: string;
  precio1a6: number;
  precio7a9: number | null;
  precio10a12: number | null;
  duracion: string;
  alias: string | null;
}

interface RouteSearchProps {
  routes: Route[];
}

/* Popular origins that appear first in the list */
const POPULAR_ORIGINS = [
  "Liberia Airport (LIR)",
  "SJO Airport (San José)",
  "La Fortuna (Arenal Volcano Area)",
  "Tamarindo (Beach Town)",
  "Manuel Antonio / Quepos",
  "Monteverde / Santa Elena",
];

export default function RouteSearch({ routes }: RouteSearchProps) {
  const [selectedOrigin, setSelectedOrigin] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("");

  const origins = useMemo(() => {
    const set = new Set(routes.map((r) => r.origen));
    const all = Array.from(set).sort();
    const popular = POPULAR_ORIGINS.filter((o) => set.has(o));
    const rest = all.filter((o) => !popular.includes(o));
    return { popular, rest };
  }, [routes]);

  const destinations = useMemo(() => {
    if (!selectedOrigin) return [];
    const set = new Set(
      routes.filter((r) => r.origen === selectedOrigin).map((r) => r.destino)
    );
    return Array.from(set).sort();
  }, [routes, selectedOrigin]);

  const matchedRoute = useMemo(() => {
    if (!selectedOrigin || !selectedDestination) return null;
    return (
      routes.find(
        (r) => r.origen === selectedOrigin && r.destino === selectedDestination
      ) ?? null
    );
  }, [routes, selectedOrigin, selectedDestination]);

  function handleOriginChange(value: string) {
    setSelectedOrigin(value);
    setSelectedDestination("");
  }

  function handleBookRoute(route: Route) {
    const msg =
      `Hi! I'd like to book a private transfer:\n\n` +
      `From: ${route.origen}\n` +
      `To: ${route.destino}\n` +
      `Price: $${route.precio1a6} (1-6 pax)\n\n` +
      `Could you help me with the booking?`;
    window.open(
      `https://wa.me/50600000000?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  }

  return (
    <>
      {/* ─── ROUTE FINDER ─── */}
      <section className="relative -mt-20 z-20 mx-auto max-w-4xl px-6">
        <div className="rounded-3xl border border-black/5 bg-white p-8 shadow-xl sm:p-10">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Find Your Route
            </h2>
            <p className="mt-2 text-foreground/60">
              Select origin and destination to see pricing
            </p>
          </div>

          {/* Steps */}
          <div className="grid gap-4 sm:grid-cols-3">
            {/* Step 1: Origin */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground/70">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sunset-orange text-xs font-bold text-white">
                  1
                </span>
                Pick Origin
              </label>
              <select
                value={selectedOrigin}
                onChange={(e) => handleOriginChange(e.target.value)}
                className="w-full rounded-xl border border-black/10 bg-light-surface px-4 py-3 text-sm text-foreground outline-none transition focus:border-sunset-orange focus:ring-2 focus:ring-sunset-orange/20"
              >
                <option value="">Select origin...</option>
                {origins.popular.length > 0 && (
                  <optgroup label="Popular">
                    {origins.popular.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </optgroup>
                )}
                <optgroup label="All origins">
                  {origins.rest.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Step 2: Destination */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground/70">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sunset-orange text-xs font-bold text-white">
                  2
                </span>
                Pick Destination
              </label>
              <select
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
                disabled={!selectedOrigin}
                className="w-full rounded-xl border border-black/10 bg-light-surface px-4 py-3 text-sm text-foreground outline-none transition focus:border-sunset-orange focus:ring-2 focus:ring-sunset-orange/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">
                  {selectedOrigin ? "Select destination..." : "Pick origin first"}
                </option>
                {destinations.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Step 3: Result */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground/70">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sunset-orange text-xs font-bold text-white">
                  3
                </span>
                Price &amp; Book
              </label>
              {matchedRoute ? (
                <button
                  onClick={() => handleBookRoute(matchedRoute)}
                  className="w-full rounded-xl bg-gradient-to-r from-sunset-red via-sunset-orange to-sunset-gold px-4 py-3 text-sm font-bold text-white transition hover:shadow-lg hover:shadow-sunset-orange/25"
                >
                  ${matchedRoute.precio1a6} &mdash; Book Now
                </button>
              ) : (
                <div className="flex h-[46px] items-center justify-center rounded-xl border border-dashed border-black/10 bg-light-surface text-sm text-foreground/40">
                  Select route to see price
                </div>
              )}
            </div>
          </div>

          {/* Price tiers when a route is matched */}
          {matchedRoute && (
            <div className="mt-6 grid grid-cols-3 gap-3 rounded-xl bg-light-surface p-4">
              <div className="text-center">
                <div className="text-lg font-bold text-sunset-orange">
                  ${matchedRoute.precio1a6}
                </div>
                <div className="text-xs text-foreground/50">1–6 pax</div>
              </div>
              {matchedRoute.precio7a9 && (
                <div className="text-center">
                  <div className="text-lg font-bold text-sunset-orange">
                    ${matchedRoute.precio7a9}
                  </div>
                  <div className="text-xs text-foreground/50">7–9 pax</div>
                </div>
              )}
              {matchedRoute.precio10a12 && (
                <div className="text-center">
                  <div className="text-lg font-bold text-sunset-orange">
                    ${matchedRoute.precio10a12}
                  </div>
                  <div className="text-xs text-foreground/50">10–12 pax</div>
                </div>
              )}
            </div>
          )}

          {/* WhatsApp alternative */}
          <div className="mt-6 text-center">
            <p className="text-sm text-foreground/50">
              Need help?{" "}
              <a
                href="https://wa.me/50600000000"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-sunset-orange transition hover:text-sunset-gold"
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.553 4.116 1.519 5.848L.058 23.306a.5.5 0 00.636.636l5.458-1.461A11.948 11.948 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.94 0-3.753-.563-5.28-1.532l-.368-.224-3.821 1.023 1.023-3.821-.224-.368A9.935 9.935 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
                </svg>
                Chat with us on WhatsApp
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* ─── TRUST BADGES ─── */}
      <section className="mx-auto max-w-4xl px-6 py-12">
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-foreground/50">
          {[
            {
              icon: "M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
              label: "Licensed & insured",
            },
            {
              icon: "M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z",
              label: "Private — just your group",
            },
            {
              icon: "M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 0 1 1.06 0Z",
              label: "Free WiFi",
            },
            {
              icon: "M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H21M3.75 18h15A2.25 2.25 0 0 0 21 15.75v-6a2.25 2.25 0 0 0-2.25-2.25h-15A2.25 2.25 0 0 0 1.5 9.75v6A2.25 2.25 0 0 0 3.75 18Z",
              label: "Phone chargers",
            },
            {
              icon: "M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
              label: "Complimentary water",
            },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <svg
                className="h-5 w-5 text-sunset-orange"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={item.icon}
                />
              </svg>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
