"use client";

import Link from "next/link";
import type { BookingDraft } from "@/lib/booking";
import { formatDate, formatPassengers, formatTime } from "@/lib/booking";

interface Props {
  draft: BookingDraft;
  /** When provided, renders an "Edit" link next to the title */
  editHref?: string;
  /** Compact variant: tighter spacing, smaller title, good for sidebar usage */
  compact?: boolean;
}

export default function BookingSummary({ draft, editHref, compact }: Props) {
  const passengers = formatPassengers(draft.adults, draft.children);

  return (
    <section
      className={`rounded-3xl border border-black/5 bg-white shadow-sm ${
        compact ? "p-5 sm:p-6" : "p-6 sm:p-8"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <h2
          className={`font-bold text-foreground ${
            compact ? "text-base" : "text-lg sm:text-xl"
          }`}
        >
          Trip summary
        </h2>
        {editHref && (
          <Link
            href={editHref}
            className="text-xs font-semibold text-sunset-orange transition hover:text-sunset-gold"
          >
            Edit
          </Link>
        )}
      </div>

      {/* Route */}
      <div className="mt-4 rounded-2xl bg-light-surface p-4 sm:p-5">
        <div className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-foreground/40">
          Your route
        </div>
        <div className="mt-2 flex flex-col items-start gap-1.5 sm:flex-row sm:items-center sm:gap-2">
          <div className="font-semibold text-foreground">{draft.from}</div>
          <svg
            className="h-4 w-4 shrink-0 rotate-90 text-sunset-orange sm:rotate-0"
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
          <div className="font-semibold text-foreground">{draft.to}</div>
        </div>
        {draft.duracion && (
          <div className="mt-2 text-xs text-foreground/50">
            Estimated travel time: {draft.duracion}
          </div>
        )}
      </div>

      {/* Grid of details */}
      <dl
        className={`mt-4 grid gap-3 ${
          compact ? "sm:grid-cols-1" : "sm:grid-cols-2"
        }`}
      >
        <Row label="Pickup date" value={formatDate(draft.date)} />
        <Row label="Pickup time" value={formatTime(draft.time)} />
        <Row label="Passengers" value={passengers} />
        <Row
          label="Vehicle"
          value={`${draft.vehicleName} · ${draft.vehiclePax}`}
        />
        {draft.isAirportPickup && draft.flight && (
          <Row label="Flight number" value={draft.flight} />
        )}
        <Row label="Pickup location" value={draft.pickup} />
        <Row label="Drop-off location" value={draft.dropoff} />
      </dl>

      {/* Total */}
      <div className="mt-5 flex items-center justify-between rounded-2xl bg-gradient-to-br from-sunset-gold/10 via-sunset-orange/10 to-sunset-red/10 p-4 sm:p-5">
        <div>
          <div className="text-xs text-foreground/60">Total (per vehicle)</div>
          <div className="text-xs text-foreground/40">
            13% VAT included · no hidden fees
          </div>
        </div>
        <div
          className={`font-extrabold text-sunset-orange ${
            compact ? "text-2xl" : "text-3xl sm:text-4xl"
          }`}
        >
          ${draft.price}
        </div>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/5 bg-light-surface/60 p-3 sm:p-4">
      <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-foreground/40">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm font-semibold text-foreground break-words">
        {value}
      </dd>
    </div>
  );
}
