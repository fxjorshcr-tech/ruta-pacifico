"use client";

import Link from "next/link";
import { formatDate, formatTime, getCartTotal, type TripItem } from "@/lib/booking";

interface Props {
  items: TripItem[];
  onRemove: (id: string) => void;
}

export default function BookingCart({ items, onRemove }: Props) {
  if (items.length === 0) return null;

  const total = getCartTotal(items);

  return (
    <div className="rounded-3xl border border-sunset-orange/20 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sunset-orange text-sm font-bold text-white">
          {items.length}
        </div>
        <h2 className="text-lg font-bold text-foreground">
          {items.length === 1 ? "Your Shuttle" : "Your Shuttles"}
        </h2>
      </div>

      <div className="mt-4 space-y-3">
        {items.map((item, idx) => (
          <div
            key={item.id}
            className="flex items-center gap-4 rounded-2xl border border-black/5 bg-light-surface p-4"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sunset-orange/10 text-xs font-bold text-sunset-orange">
              {idx + 1}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold text-foreground">
                {item.from} → {item.to}
              </div>
              <div className="mt-0.5 text-xs text-foreground/50">
                {formatDate(item.date)} · {formatTime(item.time)} · {item.vehicleName}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-sunset-orange">${item.price}</div>
            </div>
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-foreground/30 transition hover:bg-red-50 hover:text-red-500"
              aria-label="Remove shuttle"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="text-sm text-foreground/60">Total</div>
          <div className="text-2xl font-bold text-foreground">${total}</div>
          <div className="text-xs text-foreground/40">13% VAT included</div>
        </div>
        <Link
          href="/private-shuttle/checkout"
          className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-sunset-red via-sunset-orange to-sunset-gold px-8 py-4 text-base font-bold text-white shadow-lg shadow-sunset-orange/25 transition hover:shadow-xl hover:shadow-sunset-orange/40"
        >
          Continue to Checkout
          <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
