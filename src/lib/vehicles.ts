/**
 * Single source of truth for the fleet and its price tiers.
 *
 * Pricing is per vehicle, not per person: a group falls into exactly one tier
 * based on its total passenger count (adults + children).
 *
 * `priceField` points at a field of `Route`, not at a database column — the
 * shared `routes` table still names its columns `precio1a6` / `precio7a9` /
 * `precio10a12` and is not being changed. See src/lib/routes.ts for the
 * column → tier mapping.
 */

export type VehicleKey = "staria" | "hiace" | "maxus";

/** Key of the `Route` field holding this tier's price. */
export type PriceField = "precio1a5" | "precio6a9" | "precio10a12";

export interface VehicleTier {
  key: VehicleKey;
  name: string;
  /** Lowest passenger count this tier covers. */
  minPax: number;
  /** Highest passenger count this tier covers. */
  maxPax: number;
  /** Display label, e.g. "1 – 5 passengers". */
  paxLabel: string;
  image: string;
  priceField: PriceField;
}

const STARIA_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/staria-smallMobile.webp";
const HIACE_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/hiace-van-cwt.png";
const MAXUS_URL =
  "https://mmlbslwljvmscbgsqkkq.supabase.co/storage/v1/object/public/Fotos/maxus-deviver-9-cwt-removebg-preview.png";

export const VEHICLE_TIERS: VehicleTier[] = [
  {
    key: "staria",
    name: "Hyundai Staria",
    minPax: 1,
    maxPax: 5,
    paxLabel: "1 – 5 passengers",
    image: STARIA_URL,
    priceField: "precio1a5",
  },
  {
    key: "hiace",
    name: "Toyota Hiace",
    minPax: 6,
    maxPax: 9,
    paxLabel: "6 – 9 passengers",
    image: HIACE_URL,
    priceField: "precio6a9",
  },
  {
    key: "maxus",
    name: "Maxus V90",
    minPax: 10,
    maxPax: 12,
    paxLabel: "10 – 12 passengers",
    image: MAXUS_URL,
    priceField: "precio10a12",
  },
];

/** Largest group any vehicle in the fleet can carry. */
export const MAX_PAX = VEHICLE_TIERS[VEHICLE_TIERS.length - 1].maxPax;

export function isVehicleKey(value: unknown): value is VehicleKey {
  return VEHICLE_TIERS.some((t) => t.key === value);
}

export function getTier(key: VehicleKey): VehicleTier {
  return VEHICLE_TIERS.find((t) => t.key === key) ?? VEHICLE_TIERS[0];
}

/** The tier that fits a given group size, or null if the group is too large. */
export function tierForPax(pax: number): VehicleTier | null {
  return VEHICLE_TIERS.find((t) => pax <= t.maxPax) ?? null;
}
