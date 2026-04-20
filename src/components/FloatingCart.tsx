"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getCart,
  removeFromCart,
  getCartTotal,
  type TripItem,
} from "@/lib/booking";

export default function FloatingCart() {
  const [cart, setCart] = useState<TripItem[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Poll sessionStorage for changes (cross-component updates)
    function sync() {
      setCart(getCart());
    }
    sync();
    const interval = setInterval(sync, 500);
    return () => clearInterval(interval);
  }, []);

  if (cart.length === 0) return null;

  const total = getCartTotal(cart);

  function handleRemove(id: string) {
    const updated = removeFromCart(id);
    setCart(updated);
  }

  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:bottom-6 sm:right-6 z-50 flex flex-col items-stretch sm:items-end gap-3">
      {/* Expanded panel */}
      {open && (
        <div className="w-full sm:w-80 rounded-2xl border border-black/10 bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-black/5 px-5 py-4">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-sunset-orange" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              <span className="text-sm font-bold text-foreground">
                My Trip ({cart.length})
              </span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-7 w-7 items-center justify-center rounded-full text-foreground/40 transition hover:bg-black/5 hover:text-foreground"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
          </div>

          <div className="max-h-60 overflow-y-auto px-5 py-3">
            {cart.map((item, idx) => (
              <div key={item.id} className="flex items-start gap-3 py-2.5">
                <span className="mt-0.5 text-xs font-bold text-foreground/30">{idx + 1}.</span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-foreground">
                    {item.from} → {item.to}
                  </div>
                  {item.duracion && (
                    <div className="text-xs text-foreground/40">{item.duracion}</div>
                  )}
                </div>
                <div className="text-sm font-bold text-foreground">${item.price}</div>
                <button
                  type="button"
                  onClick={() => handleRemove(item.id)}
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-foreground/25 transition hover:bg-red-50 hover:text-red-500"
                  aria-label="Remove"
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <div className="border-t border-black/5 px-5 py-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-foreground/50">Estimated total</div>
                <div className="text-xl font-bold text-foreground">${total}</div>
              </div>
            </div>
            <Link
              href="/private-shuttle/checkout"
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sunset-red via-sunset-orange to-sunset-gold px-5 py-3 text-sm font-bold text-white shadow-md transition hover:shadow-lg"
            >
              Proceed to Checkout
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-full bg-sunset-orange px-5 py-3 text-sm font-bold text-white shadow-lg shadow-sunset-orange/30 transition hover:bg-sunset-red hover:shadow-xl"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
        </svg>
        My Trip ({cart.length})
        <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">${total}</span>
      </button>
    </div>
  );
}
