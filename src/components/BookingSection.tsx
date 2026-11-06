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
import type { Route } from "@/lib/routes";
import type { VehicleKey } from "@/lib/vehicles";

interface Props {
  route: Route;
  isAirportPickup: boolean;
  initialVehicle?: VehicleKey;
  originShort?: string;
  destinationShort?: string;
  returnRoute?: { href: string; price: number } | null;
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

export default function BookingSection({
  route,
  isAirportPickup,
  initialVehicle,
  originShort,
  destinationShort,
  returnRoute,
}: Props) {
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

  // Is the route of this page already in the trip? When it is not, the
  // cart below the form says so, so nobody heads to checkout believing
  // the shuttle they are looking at is included.
  const thisRouteInCart = cart.some((i) => i.from === route.origen && i.to === route.destino);

  return (
    <div ref={formRef} className="space-y-8 scroll-mt-8">
      {/* The form first: the trip so far (and its checkout button) comes
          after it, so a traveller who just arrived on this route is asked
          for its details before being offered checkout. */}
      <BookingForm
        route={route}
        isAirportPickup={isAirportPickup}
        initialVehicle={initialVehicle}
        originShort={originShort}
        destinationShort={destinationShort}
        returnRoute={returnRoute}
      />
      {cart.length > 0 && (
        <BookingCart
          items={cart}
          onRemove={handleRemove}
          pendingRoute={thisRouteInCart ? null : `${originShort ?? route.origen} → ${destinationShort ?? route.destino}`}
        />
      )}
    </div>
  );
}
