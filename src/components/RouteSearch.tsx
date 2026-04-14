"use client";

import { useState, useMemo } from "react";
import Image from "next/image";

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

const STARIA_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/staria-smallMobile.webp";
const HIACE_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/hiace-van-cwt.png";
const MAXUS_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/maxus-deviver-9-cwt-removebg-preview.png";

/* LIR first, then Guanacaste beaches, then everything else */
const GUANACASTE_PRIORITY = [
  "LIR - Liberia Int. Airport",
  "Brasilito (Guanacaste)",
  "Conchal (Guanacaste)",
  "Flamingo (Guanacaste)",
  "Hacienda Pinilla (Guanacaste)",
  "JW Marriott (Guanacaste)",
  "Las Catalinas, Guanacaste",
  "Nosara (Playa Guiones Area)",
  "Ocotal (Guanacaste)",
  "Papagayo Peninsula, Guanacaste",
  "Playa Avellanas (Guanacaste)",
  "Playa Grande (Guanacaste)",
  "Playa Hermosa (Guanacaste)",
  "Playa Potrero (Guanacaste)",
  "Playas del Coco (Guanacaste)",
  "Punta Islita (Hotel & Beach)",
  "RIU Guanacaste Hotel / RIU Palace Hotel (Guanacaste)",
  "Rincon de la Vieja (National Park)",
  "Rio Celeste",
  "Samara / Playa Carrillo (Guanacaste)",
  "Tamarindo (Guanacaste)",
];

export default function RouteSearch({ routes }: RouteSearchProps) {
  const [selectedOrigin, setSelectedOrigin] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("");

  const origins = useMemo(() => {
    const set = new Set(routes.map((r) => r.origen));
    const guanacaste = GUANACASTE_PRIORITY.filter((o) => set.has(o));
    const rest = Array.from(set)
      .filter((o) => !guanacaste.includes(o))
      .sort();
    return { guanacaste, rest };
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

  function handleBookVan(route: Route, vanType: string, price: number) {
    const msg =
      `Hi! I'd like to book a private shuttle:\n\n` +
      `From: ${route.origen}\n` +
      `To: ${route.destino}\n` +
      `Vehicle: ${vanType}\n` +
      `Price: $${price}\n\n` +
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

          {/* Steps - now 2 columns */}
          <div className="grid gap-4 sm:grid-cols-2">
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
                <optgroup label="Guanacaste">
                  {origins.guanacaste.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Other destinations">
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
          </div>

          {/* Step 3: Vehicle selection cards */}
          {matchedRoute ? (
            <div className="mt-8">
              <label className="mb-4 flex items-center gap-2 text-sm font-medium text-foreground/70">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sunset-orange text-xs font-bold text-white">
                  3
                </span>
                Choose Your Vehicle
              </label>
              <div className="grid gap-4 sm:grid-cols-3">
                {/* Staria 1-6 */}
                <button
                  onClick={() => handleBookVan(matchedRoute, "Hyundai Staria (1-6 pax)", matchedRoute.precio1a6)}
                  className="group rounded-2xl border-2 border-black/5 bg-light-surface p-4 text-center transition hover:border-sunset-orange hover:shadow-lg"
                >
                  <div className="relative mx-auto h-24 w-full">
                    <Image src={STARIA_URL} alt="Hyundai Staria" fill className="object-contain" unoptimized />
                  </div>
                  <div className="mt-3">
                    <span className="inline-block rounded-full bg-sunset-orange/10 px-3 py-0.5 text-xs font-semibold text-sunset-orange">
                      1 – 6 passengers
                    </span>
                    <h3 className="mt-2 text-sm font-bold text-foreground">Hyundai Staria</h3>
                    <p className="text-xs text-foreground/40">or similar</p>
                    <div className="mt-3 text-2xl font-bold text-sunset-orange">
                      ${matchedRoute.precio1a6}
                    </div>
                    <div className="mt-3 rounded-xl bg-gradient-to-r from-sunset-red via-sunset-orange to-sunset-gold px-4 py-2.5 text-xs font-bold text-white transition hover:shadow-lg hover:shadow-sunset-orange/25">
                      Select &amp; Book
                    </div>
                  </div>
                </button>

                {/* Hiace 7-9 */}
                {matchedRoute.precio7a9 && (
                  <button
                    onClick={() => handleBookVan(matchedRoute, "Toyota Hiace (7-9 pax)", matchedRoute.precio7a9!)}
                    className="group rounded-2xl border-2 border-black/5 bg-light-surface p-4 text-center transition hover:border-sunset-orange hover:shadow-lg"
                  >
                    <div className="relative mx-auto h-24 w-full">
                      <Image src={HIACE_URL} alt="Toyota Hiace" fill className="object-contain" unoptimized />
                    </div>
                    <div className="mt-3">
                      <span className="inline-block rounded-full bg-sunset-orange/10 px-3 py-0.5 text-xs font-semibold text-sunset-orange">
                        7 – 9 passengers
                      </span>
                      <h3 className="mt-2 text-sm font-bold text-foreground">Toyota Hiace</h3>
                      <p className="text-xs text-foreground/40">or similar</p>
                      <div className="mt-3 text-2xl font-bold text-sunset-orange">
                        ${matchedRoute.precio7a9}
                      </div>
                      <div className="mt-2 rounded-lg bg-gradient-to-r from-sunset-red via-sunset-orange to-sunset-gold px-3 py-2 text-xs font-bold text-white opacity-0 transition group-hover:opacity-100">
                        Book Now
                      </div>
                    </div>
                  </button>
                )}

                {/* Maxus 10-12 */}
                {matchedRoute.precio10a12 && (
                  <button
                    onClick={() => handleBookVan(matchedRoute, "Maxus V90 (10-12 pax)", matchedRoute.precio10a12!)}
                    className="group rounded-2xl border-2 border-black/5 bg-light-surface p-4 text-center transition hover:border-sunset-orange hover:shadow-lg"
                  >
                    <div className="relative mx-auto h-24 w-full">
                      <Image src={MAXUS_URL} alt="Maxus V90" fill className="object-contain" unoptimized />
                    </div>
                    <div className="mt-3">
                      <span className="inline-block rounded-full bg-sunset-orange/10 px-3 py-0.5 text-xs font-semibold text-sunset-orange">
                        10 – 12 passengers
                      </span>
                      <h3 className="mt-2 text-sm font-bold text-foreground">Maxus V90</h3>
                      <p className="text-xs text-foreground/40">or similar</p>
                      <div className="mt-3 text-2xl font-bold text-sunset-orange">
                        ${matchedRoute.precio10a12}
                      </div>
                      <div className="mt-2 rounded-lg bg-gradient-to-r from-sunset-red via-sunset-orange to-sunset-gold px-3 py-2 text-xs font-bold text-white opacity-0 transition group-hover:opacity-100">
                        Book Now
                      </div>
                    </div>
                  </button>
                )}
              </div>

              {/* Duration info */}
              {matchedRoute.duracion && (
                <p className="mt-4 text-center text-sm text-foreground/40">
                  Estimated travel time: {matchedRoute.duracion}
                </p>
              )}
            </div>
          ) : (
            selectedOrigin && selectedDestination === "" && (
              <div className="mt-8 flex items-center justify-center rounded-xl border border-dashed border-black/10 bg-light-surface py-8 text-sm text-foreground/40">
                Select a destination to see available vehicles
              </div>
            )
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
      <section className="mx-auto max-w-5xl px-6 pt-12 pb-4">
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4 text-sm text-foreground/60">
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
              icon: "M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25V9m-3 0h13.5M6.75 9v10.5A2.25 2.25 0 0 0 9 21.75h6a2.25 2.25 0 0 0 2.25-2.25V9",
              label: "Luggage included",
            },
            {
              icon: "M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z",
              label: "Free child seats",
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
            {
              icon: "M2.25 8.25h19.5M2.25 9v10.5A1.5 1.5 0 0 0 3.75 21h16.5a1.5 1.5 0 0 0 1.5-1.5V9M3.75 3h16.5A1.5 1.5 0 0 1 21.75 4.5v3.75H2.25V4.5A1.5 1.5 0 0 1 3.75 3Z",
              label: "No hidden fees",
            },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <svg
                className="h-5 w-5 shrink-0 text-sunset-orange"
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
