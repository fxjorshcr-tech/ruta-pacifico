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

import { defineCopy, type Locale } from "@/lib/i18n";

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
  /** Who usually books this size, for price lists and llms.txt. */
  typicalUse: string;
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
    typicalUse: "Families, couples, solo travellers",
    image: STARIA_URL,
    priceField: "precio1a5",
  },
  {
    key: "hiace",
    name: "Toyota Hiace",
    minPax: 6,
    maxPax: 9,
    paxLabel: "6 – 9 passengers",
    typicalUse: "Medium groups, extra luggage or surfboards",
    image: HIACE_URL,
    priceField: "precio6a9",
  },
  {
    key: "maxus",
    name: "Maxus V90",
    minPax: 10,
    maxPax: 12,
    paxLabel: "10 – 12 passengers",
    typicalUse: "Large groups, wedding parties, corporate groups",
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

/** The display strings of a tier that change with the visitor's language. */
export interface VehicleTierCopy {
  /** e.g. "1 – 5 passengers" / "1 – 5 pasajeros". */
  paxLabel: string;
  /** Who usually books this size. */
  typicalUse: string;
}

function englishTierCopy(): Record<VehicleKey, VehicleTierCopy> {
  const out = {} as Record<VehicleKey, VehicleTierCopy>;
  for (const tier of VEHICLE_TIERS) {
    out[tier.key] = { paxLabel: tier.paxLabel, typicalUse: tier.typicalUse };
  }
  return out;
}

/**
 * Localized tier labels. English is read straight from `VEHICLE_TIERS` so the
 * two can never drift; `VEHICLE_TIERS` itself stays English for llms.txt and
 * the data stored with a booking.
 */
export const VEHICLE_TIER_COPY = defineCopy<Record<VehicleKey, VehicleTierCopy>>({
  en: englishTierCopy(),
  es: {
    staria: {
      paxLabel: "1 – 5 pasajeros",
      typicalUse: "Familias, parejas y viajeros solos",
    },
    hiace: {
      paxLabel: "6 – 9 pasajeros",
      typicalUse: "Grupos medianos, equipaje extra o tablas de surf",
    },
    maxus: {
      paxLabel: "10 – 12 pasajeros",
      typicalUse: "Grupos grandes, bodas y grupos corporativos",
    },
  },
});

/** Tier labels in the visitor's language (English when the locale is omitted). */
export function vehicleTierCopy(key: VehicleKey, locale: Locale = "en"): VehicleTierCopy {
  return VEHICLE_TIER_COPY[locale][key] ?? VEHICLE_TIER_COPY.en[key];
}
