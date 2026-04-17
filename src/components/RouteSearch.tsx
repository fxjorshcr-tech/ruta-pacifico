"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ComboBox, { type ComboOption } from "@/components/ComboBox";
import { routeSlug } from "@/lib/slug";

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

type VehicleKey = "staria" | "hiace" | "maxus";

const STARIA_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/staria-smallMobile.webp";
const HIACE_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/hiace-van-cwt.png";
const MAXUS_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/maxus-deviver-9-cwt-removebg-preview.png";

/* Airport prefixes — LIR first, then SJO. Any origin in the DB whose label
   starts with one of these prefixes is grouped under "Airports". */
const AIRPORT_PREFIXES = ["LIR", "SJO"];

const GUANACASTE_PRIORITY = [
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
  const router = useRouter();
  const [selectedOrigin, setSelectedOrigin] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleKey | null>(
    null
  );
  const vehicleStepRef = useRef<HTMLDivElement>(null);

  // Build grouped origin options: Airports → Guanacaste → Other
  const originOptions: ComboOption[] = useMemo(() => {
    const all = Array.from(new Set(routes.map((r) => r.origen)));

    const airports: string[] = [];
    for (const prefix of AIRPORT_PREFIXES) {
      const matches = all
        .filter((o) => o.toUpperCase().startsWith(prefix))
        .sort();
      airports.push(...matches);
    }

    const guanacaste = GUANACASTE_PRIORITY.filter((o) => all.includes(o));

    const used = new Set([...airports, ...guanacaste]);
    const rest = all.filter((o) => !used.has(o)).sort();

    const opts: ComboOption[] = [];
    for (const o of airports) opts.push({ value: o, label: o, group: "Airports" });
    for (const o of guanacaste)
      opts.push({ value: o, label: o, group: "Guanacaste" });
    for (const o of rest)
      opts.push({ value: o, label: o, group: "Other destinations" });
    return opts;
  }, [routes]);

  // Destinations for the currently selected origin
  const destinationOptions: ComboOption[] = useMemo(() => {
    if (!selectedOrigin) return [];
    const dests = Array.from(
      new Set(
        routes
          .filter((r) => r.origen === selectedOrigin)
          .map((r) => r.destino)
      )
    );

    // Apply the same group ordering to destinations where possible
    const airports: string[] = [];
    for (const prefix of AIRPORT_PREFIXES) {
      airports.push(
        ...dests.filter((d) => d.toUpperCase().startsWith(prefix)).sort()
      );
    }
    const guanacaste = GUANACASTE_PRIORITY.filter((d) => dests.includes(d));
    const used = new Set([...airports, ...guanacaste]);
    const rest = dests.filter((d) => !used.has(d)).sort();

    const opts: ComboOption[] = [];
    for (const d of airports) opts.push({ value: d, label: d, group: "Airports" });
    for (const d of guanacaste)
      opts.push({ value: d, label: d, group: "Guanacaste" });
    for (const d of rest)
      opts.push({ value: d, label: d, group: "Other destinations" });
    return opts;
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
    setSelectedVehicle(null);
  }

  function handleDestinationChange(value: string) {
    setSelectedDestination(value);
    setSelectedVehicle(null);
  }

  function handleContinue() {
    if (!matchedRoute || !selectedVehicle) return;
    const slug = routeSlug(matchedRoute.origen, matchedRoute.destino);
    router.push(`/private-shuttle/${slug}?v=${selectedVehicle}#booking`);
  }

  // Gently reveal Step 3 (vehicle selection) once the user has picked both
  // origin and destination. Without this, on mobile the new section appears
  // below the fold and the page feels unresponsive.
  useEffect(() => {
    if (!matchedRoute) return;
    const el = vehicleStepRef.current;
    if (!el) return;
    const id = window.requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => window.cancelAnimationFrame(id);
  }, [matchedRoute]);

  const vehicleCards: {
    key: VehicleKey;
    name: string;
    pax: string;
    image: string;
    price: number | null;
  }[] = matchedRoute
    ? [
        {
          key: "staria",
          name: "Hyundai Staria",
          pax: "1 – 6 passengers",
          image: STARIA_URL,
          price: matchedRoute.precio1a6,
        },
        {
          key: "hiace",
          name: "Toyota Hiace",
          pax: "7 – 9 passengers",
          image: HIACE_URL,
          price: matchedRoute.precio7a9,
        },
        {
          key: "maxus",
          name: "Maxus V90",
          pax: "10 – 12 passengers",
          image: MAXUS_URL,
          price: matchedRoute.precio10a12,
        },
      ]
    : [];

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

          {/* Steps - 2 columns */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Step 1: Origin */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground/70">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sunset-orange text-xs font-bold text-white">
                  1
                </span>
                Pick Origin
              </label>
              <ComboBox
                options={originOptions}
                value={selectedOrigin}
                onChange={handleOriginChange}
                placeholder="Type an origin (e.g. LIR, SJO, Tamarindo…)"
              />
            </div>

            {/* Step 2: Destination */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground/70">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sunset-orange text-xs font-bold text-white">
                  2
                </span>
                Pick Destination
              </label>
              <ComboBox
                options={destinationOptions}
                value={selectedDestination}
                onChange={handleDestinationChange}
                placeholder={
                  selectedOrigin ? "Type a destination…" : "Pick origin first"
                }
                disabled={!selectedOrigin}
              />
            </div>
          </div>

          {/* Step 3: Vehicle selection */}
          {matchedRoute ? (
            <div ref={vehicleStepRef} className="mt-10 scroll-mt-24">
              <label className="mb-4 flex items-center gap-2 text-sm font-medium text-foreground/70">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sunset-orange text-xs font-bold text-white">
                  3
                </span>
                Choose Your Vehicle
              </label>
              <div className="grid gap-4 sm:grid-cols-3">
                {vehicleCards.map((v) => {
                  if (v.price == null) return null;
                  const active = selectedVehicle === v.key;
                  return (
                    <button
                      type="button"
                      key={v.key}
                      onClick={() => setSelectedVehicle(v.key)}
                      aria-pressed={active}
                      className={`group relative rounded-2xl border-2 p-4 text-center transition ${
                        active
                          ? "border-sunset-orange bg-sunset-orange/5 shadow-lg shadow-sunset-orange/15 ring-4 ring-sunset-orange/15"
                          : "border-black/5 bg-light-surface hover:border-sunset-orange/40 hover:shadow-md"
                      }`}
                    >
                      {active && (
                        <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-sunset-orange text-white shadow-md">
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={3.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                          </svg>
                        </div>
                      )}
                      <div className="relative mx-auto h-24 w-full">
                        <Image
                          src={v.image}
                          alt={v.name}
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                      <div className="mt-3">
                        <span className="inline-block rounded-full bg-sunset-orange/10 px-3 py-0.5 text-xs font-semibold text-sunset-orange">
                          {v.pax}
                        </span>
                        <h3 className="mt-2 text-sm font-bold text-foreground">
                          {v.name}
                        </h3>
                        <p className="text-xs text-foreground/40">or similar</p>
                        <div className="mt-3 text-2xl font-bold text-sunset-orange">
                          ${v.price}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Duration info */}
              {matchedRoute.duracion && (
                <p className="mt-4 text-center text-xs text-foreground/40">
                  Estimated travel time: {matchedRoute.duracion}
                </p>
              )}

              {/* Continue button */}
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={handleContinue}
                  disabled={!selectedVehicle}
                  className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-sunset-red via-sunset-orange to-sunset-gold px-10 py-4 text-base font-bold text-white shadow-lg shadow-sunset-orange/25 transition hover:shadow-xl hover:shadow-sunset-orange/40 hover:scale-[1.02] disabled:cursor-not-allowed disabled:bg-none disabled:bg-foreground/10 disabled:text-foreground/40 disabled:shadow-none disabled:hover:scale-100"
                >
                  {selectedVehicle
                    ? "Continue to booking"
                    : "Select a vehicle to continue"}
                  {selectedVehicle && (
                    <svg
                      className="h-5 w-5 transition-transform group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                      />
                    </svg>
                  )}
                </button>
              </div>
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
                href="https://wa.me/50685962438"
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
