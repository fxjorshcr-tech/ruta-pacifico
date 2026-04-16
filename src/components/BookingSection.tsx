"use client";

import { useState, useEffect } from "react";
import BookingForm from "@/components/BookingForm";
import BookingCart from "@/components/BookingCart";
import { getCart, removeFromCart, type TripItem } from "@/lib/booking";
import type { Route } from "@/components/RouteSearch";

type VehicleKey = "staria" | "hiace" | "maxus";

interface Props {
  route: Route;
  isAirportPickup: boolean;
  initialVehicle?: VehicleKey;
}

export default function BookingSection({ route, isAirportPickup, initialVehicle }: Props) {
  const [cart, setCart] = useState<TripItem[]>([]);

  useEffect(() => {
    setCart(getCart());
  }, []);

  function handleCartUpdate(updatedCart: TripItem[]) {
    setCart(updatedCart);
  }

  function handleRemove(id: string) {
    const updatedCart = removeFromCart(id);
    setCart(updatedCart);
  }

  return (
    <div className="space-y-8">
      {cart.length > 0 && (
        <BookingCart items={cart} onRemove={handleRemove} />
      )}
      <BookingForm
        route={route}
        isAirportPickup={isAirportPickup}
        initialVehicle={initialVehicle}
        onCartUpdate={handleCartUpdate}
      />
    </div>
  );
}
