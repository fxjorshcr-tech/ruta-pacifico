"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Route } from "@/components/RouteSearch";
import DatePicker from "@/components/DatePicker";
import TimePicker from "@/components/TimePicker";
import {
  addToCart,
  getCart,
  generateTripId,
  type TripItem,
} from "@/lib/booking";

const STARIA_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/staria-smallMobile.webp";
const HIACE_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/hiace-van-cwt.png";
const MAXUS_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/maxus-deviver-9-cwt-removebg-preview.png";

type VehicleKey = "staria" | "hiace" | "maxus";

interface Props {
  route: Route;
  isAirportPickup: boolean;
  initialVehicle?: VehicleKey;
  onCartUpdate?: (cart: TripItem[]) => void;
}

interface VehicleOption {
  key: VehicleKey;
  name: string;
  pax: string;
  image: string;
  price: number;
}

export default function BookingForm({ route, isAirportPickup, initialVehicle, onCartUpdate }: Props) {
  const router = useRouter();
  const successRef = useRef<HTMLDivElement>(null);
  const [added, setAdded] = useState(false);

  const vehicles: VehicleOption[] = useMemo(() => {
    const list: VehicleOption[] = [
      {
        key: "staria",
        name: "Hyundai Staria",
        pax: "1 – 6 passengers",
        image: STARIA_URL,
        price: route.precio1a6,
      },
    ];
    if (route.precio7a9) {
      list.push({
        key: "hiace",
        name: "Toyota Hiace",
        pax: "7 – 9 passengers",
        image: HIACE_URL,
        price: route.precio7a9,
      });
    }
    if (route.precio10a12) {
      list.push({
        key: "maxus",
        name: "Maxus V90",
        pax: "10 – 12 passengers",
        image: MAXUS_URL,
        price: route.precio10a12,
      });
    }
    return list;
  }, [route]);

  const [vehicleKey, setVehicleKey] = useState<VehicleKey>(() => {
    if (initialVehicle && vehicles.some((v) => v.key === initialVehicle)) {
      return initialVehicle;
    }
    return vehicles[0].key;
  });

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [flight, setFlight] = useState("");
  const [pickupAddr, setPickupAddr] = useState("");
  const [dropoffAddr, setDropoffAddr] = useState("");

  // Personal info is collected on the checkout page

  const [submitting, setSubmitting] = useState(false);
  const [showDateTimeError, setShowDateTimeError] = useState(false);

  const selectedVehicle =
    vehicles.find((v) => v.key === vehicleKey) ?? vehicles[0];

  const totalPax = adults + children;
  const vehicleTooSmall =
    (vehicleKey === "staria" && totalPax > 6) ||
    (vehicleKey === "hiace" && totalPax > 9) ||
    (vehicleKey === "maxus" && totalPax > 12);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (vehicleTooSmall) return;
    if (!date || !time) {
      setShowDateTimeError(true);
      return;
    }
    setShowDateTimeError(false);
    setSubmitting(true);

    const tripItem: TripItem = {
      id: generateTripId(),
      from: route.origen,
      to: route.destino,
      duracion: route.duracion ?? null,
      date,
      time,
      adults,
      children,
      flight: isAirportPickup ? flight : undefined,
      pickup: pickupAddr,
      dropoff: dropoffAddr,
      vehicleKey: selectedVehicle.key,
      vehicleName: selectedVehicle.name,
      vehiclePax: selectedVehicle.pax,
      price: selectedVehicle.price,
      isAirportPickup,
    };

    const updatedCart = addToCart(tripItem);
    onCartUpdate?.(updatedCart);
    setAdded(true);
    setSubmitting(false);

    // Scroll the success message into view
    setTimeout(() => {
      successRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* ── Section 1: Trip details ── */}
      <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sunset-orange text-sm font-bold text-white">
            1
          </span>
          <h2 className="text-xl font-bold text-foreground sm:text-2xl">
            Trip Details
          </h2>
        </div>

        {/* Vehicle selection */}
        <div>
          <label className="text-sm font-medium text-foreground/70">
            Choose your vehicle
          </label>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {vehicles.map((v) => {
              const active = v.key === vehicleKey;
              return (
                <button
                  type="button"
                  key={v.key}
                  onClick={() => setVehicleKey(v.key)}
                  className={`group rounded-2xl border-2 p-4 text-center transition ${
                    active
                      ? "border-sunset-orange bg-sunset-orange/5 shadow-md"
                      : "border-black/5 bg-light-surface hover:border-sunset-orange/40"
                  }`}
                >
                  <div className="relative mx-auto h-20 w-full">
                    <Image
                      src={v.image}
                      alt={v.name}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                  <div className="mt-2 text-xs font-semibold text-foreground/50">
                    {v.pax}
                  </div>
                  <div className="mt-1 text-sm font-bold text-foreground">
                    {v.name}
                  </div>
                  <div className="mt-2 text-xl font-bold text-sunset-orange">
                    ${v.price}
                  </div>
                </button>
              );
            })}
          </div>
          {vehicleTooSmall && (
            <p className="mt-3 text-xs font-medium text-red-600">
              The selected vehicle doesn&apos;t fit your group size — please
              choose a larger one.
            </p>
          )}
        </div>

        {/* When — Date + Time */}
        <div className="mt-8">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground/70">
            <svg className="h-4 w-4 text-sunset-orange" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
            When would you like to be picked up?
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <DatePicker value={date} onChange={setDate} />
            <TimePicker value={time} onChange={setTime} />
          </div>
          {showDateTimeError && (
            <p className="mt-3 text-xs font-medium text-red-600">
              Please choose a pickup date and time to continue.
            </p>
          )}
        </div>

        {/* Travelers — Adults + Children steppers */}
        <div className="mt-6">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground/70">
            <svg className="h-4 w-4 text-sunset-orange" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            </svg>
            Who&apos;s travelling?
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {/* Adults stepper */}
            <div className="flex items-center gap-4 rounded-2xl border-2 border-black/5 bg-white p-5 transition hover:border-sunset-orange/40 hover:shadow-md">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sunset-orange/20 to-sunset-gold/20 text-sunset-orange">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-foreground/40">
                  Adults
                </div>
                <div className="text-xs text-foreground/50">13+ years</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAdults(Math.max(1, adults - 1))}
                  disabled={adults <= 1}
                  aria-label="Remove adult"
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-black/10 text-foreground transition hover:border-sunset-orange hover:bg-sunset-orange/5 hover:text-sunset-orange disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-black/10 disabled:hover:bg-transparent disabled:hover:text-foreground"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                  </svg>
                </button>
                <span className="w-7 text-center text-xl font-bold tabular-nums text-foreground">
                  {adults}
                </span>
                <button
                  type="button"
                  onClick={() => setAdults(Math.min(12, adults + 1))}
                  disabled={adults >= 12}
                  aria-label="Add adult"
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-sunset-orange/30 bg-sunset-orange/5 text-sunset-orange transition hover:border-sunset-orange hover:bg-sunset-orange hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m7-7H5" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Children stepper */}
            <div className="flex items-center gap-4 rounded-2xl border-2 border-black/5 bg-white p-5 transition hover:border-sunset-orange/40 hover:shadow-md">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sunset-orange/20 to-sunset-gold/20 text-sunset-orange">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 0v2.25m0 0-3 4.5m3-4.5 3 4.5m-6 0v4.5m6-4.5v4.5" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-foreground/40">
                  Children
                </div>
                <div className="text-xs text-foreground/50">Free child seats</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setChildren(Math.max(0, children - 1))}
                  disabled={children <= 0}
                  aria-label="Remove child"
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-black/10 text-foreground transition hover:border-sunset-orange hover:bg-sunset-orange/5 hover:text-sunset-orange disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-black/10 disabled:hover:bg-transparent disabled:hover:text-foreground"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                  </svg>
                </button>
                <span className="w-7 text-center text-xl font-bold tabular-nums text-foreground">
                  {children}
                </span>
                <button
                  type="button"
                  onClick={() => setChildren(Math.min(10, children + 1))}
                  disabled={children >= 10}
                  aria-label="Add child"
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-sunset-orange/30 bg-sunset-orange/5 text-sunset-orange transition hover:border-sunset-orange hover:bg-sunset-orange hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m7-7H5" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Flight (conditional) */}
        {isAirportPickup && (
          <div className="mt-6">
            <label
              htmlFor="booking-flight"
              className="text-sm font-medium text-foreground/70"
            >
              Flight number
            </label>
            <input
              id="booking-flight"
              type="text"
              required
              placeholder="e.g. UA1234"
              value={flight}
              onChange={(e) => setFlight(e.target.value.toUpperCase())}
              className="mt-2 w-full rounded-xl border border-black/10 bg-light-surface px-4 py-3 text-sm text-foreground outline-none transition focus:border-sunset-orange focus:ring-2 focus:ring-sunset-orange/20"
            />
            <p className="mt-1 text-xs text-foreground/40">
              We&apos;ll track your flight and adjust the pickup if it&apos;s
              early or late.
            </p>
          </div>
        )}

        {/* Addresses */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="booking-pickup"
              className="text-sm font-medium text-foreground/70"
            >
              Pickup location{" "}
              <span className="text-sunset-orange">({route.origen})</span>
            </label>
            <input
              id="booking-pickup"
              type="text"
              required
              placeholder={
                isAirportPickup
                  ? "Terminal / airline"
                  : "Hotel, villa or address"
              }
              value={pickupAddr}
              onChange={(e) => setPickupAddr(e.target.value)}
              className="mt-2 w-full rounded-xl border border-black/10 bg-light-surface px-4 py-3 text-sm text-foreground outline-none transition focus:border-sunset-orange focus:ring-2 focus:ring-sunset-orange/20"
            />
          </div>
          <div>
            <label
              htmlFor="booking-dropoff"
              className="text-sm font-medium text-foreground/70"
            >
              Drop-off location{" "}
              <span className="text-sunset-orange">({route.destino})</span>
            </label>
            <input
              id="booking-dropoff"
              type="text"
              required
              placeholder="Hotel, villa or address"
              value={dropoffAddr}
              onChange={(e) => setDropoffAddr(e.target.value)}
              className="mt-2 w-full rounded-xl border border-black/10 bg-light-surface px-4 py-3 text-sm text-foreground outline-none transition focus:border-sunset-orange focus:ring-2 focus:ring-sunset-orange/20"
            />
          </div>
        </div>
      </section>

      {/* ── Submit ── */}
      {added ? (
        <div ref={successRef} className="rounded-3xl border border-green-200 bg-green-50 p-6 text-center sm:p-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-bold text-foreground">Shuttle added</h3>
          <p className="mt-2 text-sm text-foreground/60">
            {route.origen} → {route.destino} has been added to your trip.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => router.push("/private-shuttle")}
              className="inline-flex items-center gap-2 rounded-full border-2 border-sunset-orange px-6 py-3 text-sm font-bold text-sunset-orange transition hover:bg-sunset-orange/5"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add another shuttle
            </button>
            <button
              type="button"
              onClick={() => router.push("/private-shuttle/checkout")}
              className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-sunset-red via-sunset-orange to-sunset-gold px-8 py-3 text-sm font-bold text-white shadow-lg shadow-sunset-orange/25 transition hover:shadow-xl hover:shadow-sunset-orange/40"
            >
              Continue to Checkout
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-sunset-orange/20 bg-sunset-orange/5 p-6 sm:p-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="text-sm text-foreground/60">This shuttle</div>
              <div className="text-3xl font-bold text-sunset-orange">
                ${selectedVehicle.price}
              </div>
              <div className="text-xs text-foreground/40">
                13% VAT included
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting || vehicleTooSmall}
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-sunset-red via-sunset-orange to-sunset-gold px-10 py-4 text-base font-bold text-white shadow-lg shadow-sunset-orange/25 transition hover:shadow-xl hover:shadow-sunset-orange/40 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Adding…" : "Add to Trip"}
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
