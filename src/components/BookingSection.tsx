"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
} from "react";
import BookingForm from "@/components/BookingForm";
import BookingCart from "@/components/BookingCart";
import {
  CART_STORAGE_KEY,
  removeFromCart,
  type TripItem,
} from "@/lib/booking";
import type { Route } from "@/components/RouteSearch";

type VehicleKey = "staria" | "hiace" | "maxus";

interface Props {
  route: Route;
  isAirportPickup: boolean;
  initialVehicle?: VehicleKey;
}

function subscribeCart(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener("rp-cart-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("rp-cart-change", callback);
  };
}

function getCartSnapshot(): string {
  if (typeof window === "undefined") return "[]";
  try {
    return window.sessionStorage.getItem(CART_STORAGE_KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

function getCartServerSnapshot(): string {
  return "[]";
}

export default function BookingSection({ route, isAirportPickup, initialVehicle }: Props) {
  const formRef = useRef<HTMLDivElement>(null);

  const raw = useSyncExternalStore(
    subscribeCart,
    getCartSnapshot,
    getCartServerSnapshot
  );

  const cart = useMemo<TripItem[]>(() => {
    try {
      return JSON.parse(raw) as TripItem[];
    } catch {
      return [];
    }
  }, [raw]);

  useEffect(() => {
    if (window.location.hash !== "#booking") return;
    const id = window.setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
    return () => window.clearTimeout(id);
  }, []);

  function handleRemove(id: string) {
    removeFromCart(id);
  }

  return (
    <div ref={formRef} className="space-y-8 scroll-mt-8">
      {cart.length > 0 && (
        <BookingCart items={cart} onRemove={handleRemove} />
      )}
      <BookingForm
        route={route}
        isAirportPickup={isAirportPickup}
        initialVehicle={initialVehicle}
      />
    </div>
  );
}
