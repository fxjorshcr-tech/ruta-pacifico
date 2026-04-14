"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { Route } from "@/components/RouteSearch";

const STARIA_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/staria-smallMobile.webp";
const HIACE_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/hiace-van-cwt.png";
const MAXUS_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/maxus-deviver-9-cwt-removebg-preview.png";

const WHATSAPP_NUMBER = "50685962438";

type VehicleKey = "staria" | "hiace" | "maxus";

interface Props {
  route: Route;
  isAirportPickup: boolean;
  initialVehicle?: VehicleKey;
}

interface VehicleOption {
  key: VehicleKey;
  name: string;
  pax: string;
  image: string;
  price: number;
}

export default function BookingForm({ route, isAirportPickup, initialVehicle }: Props) {
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

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const selectedVehicle =
    vehicles.find((v) => v.key === vehicleKey) ?? vehicles[0];

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const lines = [
      `Hi! I'd like to book a private shuttle:`,
      ``,
      `From: ${route.origen}`,
      `To: ${route.destino}`,
      `Date: ${date}`,
      `Pickup time: ${time}`,
      `Passengers: ${adults} adult${adults === 1 ? "" : "s"}${
        children > 0 ? `, ${children} child${children === 1 ? "" : "ren"}` : ""
      }`,
    ];
    if (isAirportPickup && flight) {
      lines.push(`Flight #: ${flight}`);
    }
    lines.push(`Pickup location: ${pickupAddr}`);
    lines.push(`Drop-off location: ${dropoffAddr}`);
    lines.push(`Vehicle: ${selectedVehicle.name} (${selectedVehicle.pax})`);
    lines.push(`Price: $${selectedVehicle.price}`);
    lines.push(``);
    lines.push(`Name: ${name}`);
    lines.push(`Email: ${email}`);
    lines.push(`Phone: ${phone}`);
    if (notes) {
      lines.push(`Notes: ${notes}`);
    }
    lines.push(``);
    lines.push(`Please confirm availability. Thank you!`);

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      lines.join("\n")
    )}`;
    window.open(url, "_blank");
    setSubmitting(false);
  }

  const totalPax = adults + children;
  const vehicleTooSmall =
    (vehicleKey === "staria" && totalPax > 6) ||
    (vehicleKey === "hiace" && totalPax > 9) ||
    (vehicleKey === "maxus" && totalPax > 12);

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

        {/* Date / time */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="booking-date"
              className="text-sm font-medium text-foreground/70"
            >
              Pickup date
            </label>
            <input
              id="booking-date"
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-2 w-full rounded-xl border border-black/10 bg-light-surface px-4 py-3 text-sm text-foreground outline-none transition focus:border-sunset-orange focus:ring-2 focus:ring-sunset-orange/20"
            />
          </div>
          <div>
            <label
              htmlFor="booking-time"
              className="text-sm font-medium text-foreground/70"
            >
              Pickup time
            </label>
            <input
              id="booking-time"
              type="time"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="mt-2 w-full rounded-xl border border-black/10 bg-light-surface px-4 py-3 text-sm text-foreground outline-none transition focus:border-sunset-orange focus:ring-2 focus:ring-sunset-orange/20"
            />
          </div>
        </div>

        {/* Pax */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="booking-adults"
              className="text-sm font-medium text-foreground/70"
            >
              Adults
            </label>
            <input
              id="booking-adults"
              type="number"
              required
              min={1}
              max={12}
              value={adults}
              onChange={(e) => setAdults(Number(e.target.value))}
              className="mt-2 w-full rounded-xl border border-black/10 bg-light-surface px-4 py-3 text-sm text-foreground outline-none transition focus:border-sunset-orange focus:ring-2 focus:ring-sunset-orange/20"
            />
          </div>
          <div>
            <label
              htmlFor="booking-children"
              className="text-sm font-medium text-foreground/70"
            >
              Children
            </label>
            <input
              id="booking-children"
              type="number"
              min={0}
              max={10}
              value={children}
              onChange={(e) => setChildren(Number(e.target.value))}
              className="mt-2 w-full rounded-xl border border-black/10 bg-light-surface px-4 py-3 text-sm text-foreground outline-none transition focus:border-sunset-orange focus:ring-2 focus:ring-sunset-orange/20"
            />
            <p className="mt-1 text-xs text-foreground/40">
              Child seats included free of charge.
            </p>
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
              Pickup location
            </label>
            <input
              id="booking-pickup"
              type="text"
              required
              placeholder={
                isAirportPickup
                  ? "Terminal / airline"
                  : "Hotel or address"
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
              Drop-off location
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

      {/* ── Section 2: Personal info ── */}
      <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sunset-orange text-sm font-bold text-white">
            2
          </span>
          <h2 className="text-xl font-bold text-foreground sm:text-2xl">
            Your Information
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label
              htmlFor="booking-name"
              className="text-sm font-medium text-foreground/70"
            >
              Full name
            </label>
            <input
              id="booking-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-xl border border-black/10 bg-light-surface px-4 py-3 text-sm text-foreground outline-none transition focus:border-sunset-orange focus:ring-2 focus:ring-sunset-orange/20"
            />
          </div>
          <div>
            <label
              htmlFor="booking-email"
              className="text-sm font-medium text-foreground/70"
            >
              Email
            </label>
            <input
              id="booking-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-xl border border-black/10 bg-light-surface px-4 py-3 text-sm text-foreground outline-none transition focus:border-sunset-orange focus:ring-2 focus:ring-sunset-orange/20"
            />
          </div>
          <div>
            <label
              htmlFor="booking-phone"
              className="text-sm font-medium text-foreground/70"
            >
              Phone / WhatsApp
            </label>
            <input
              id="booking-phone"
              type="tel"
              required
              placeholder="+1 555 000 0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-2 w-full rounded-xl border border-black/10 bg-light-surface px-4 py-3 text-sm text-foreground outline-none transition focus:border-sunset-orange focus:ring-2 focus:ring-sunset-orange/20"
            />
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="booking-notes"
              className="text-sm font-medium text-foreground/70"
            >
              Special requests{" "}
              <span className="text-foreground/40">(optional)</span>
            </label>
            <textarea
              id="booking-notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Child seats, extra stops, luggage notes…"
              className="mt-2 w-full resize-none rounded-xl border border-black/10 bg-light-surface px-4 py-3 text-sm text-foreground outline-none transition focus:border-sunset-orange focus:ring-2 focus:ring-sunset-orange/20"
            />
          </div>
        </div>
      </section>

      {/* ── Submit ── */}
      <div className="rounded-3xl border border-sunset-orange/20 bg-sunset-orange/5 p-6 sm:p-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="text-sm text-foreground/60">Total (per vehicle)</div>
            <div className="text-3xl font-bold text-sunset-orange">
              ${selectedVehicle.price}
            </div>
            <div className="text-xs text-foreground/40">
              13% VAT included · no hidden fees
            </div>
          </div>
          <button
            type="submit"
            disabled={submitting || vehicleTooSmall}
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-sunset-red via-sunset-orange to-sunset-gold px-10 py-4 text-base font-bold text-white shadow-lg shadow-sunset-orange/25 transition hover:shadow-xl hover:shadow-sunset-orange/40 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <svg
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.553 4.116 1.519 5.848L.058 23.306a.5.5 0 00.636.636l5.458-1.461A11.948 11.948 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.94 0-3.753-.563-5.28-1.532l-.368-.224-3.821 1.023 1.023-3.821-.224-.368A9.935 9.935 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
            </svg>
            Confirm &amp; Book on WhatsApp
          </button>
        </div>
        <p className="mt-4 text-center text-xs text-foreground/50 sm:text-right">
          Pressing the button opens WhatsApp with your booking details
          pre-filled. We&apos;ll reply to confirm availability.
        </p>
      </div>
    </form>
  );
}
