"use client";

import { useId, useState } from "react";
import Link from "@/components/LocaleLink";
import { useLocale } from "@/components/LocaleProvider";
import { DESTINATION_HUB, HUB_ROUTE_LIST } from "@/i18n/destinationHub";
import type { PickerRoute } from "@/lib/hubPicker";
import { VEHICLE_TIERS } from "@/lib/vehicles";

interface Props {
  /** Short name of the place the hub is about: "Tamarindo". */
  place: string;
  /** Routes arriving at the place, most booked first (src/lib/hubPicker.ts). */
  arrivals: PickerRoute[];
  /** Routes leaving the place, most booked first. */
  departures: PickerRoute[];
  /** How many routes show before the "See the other N routes" button. */
  featured?: number;
  /** Anchor of the section, for the picker's "All routes" link. */
  id?: string;
}

type Direction = PickerRoute["direction"];

/**
 * The one route list of a hub page. The old page stacked two full tables
 * (every arrival, then every departure, three prices each): 66 cards and
 * 200 figures on a phone before anything that helps a traveller decide.
 * This list shows one direction at a time, one price per route for the
 * group size the traveller picks, and the most-booked routes first, with
 * the long tail behind a button.
 *
 * Both directions and every route stay in the server HTML (the inactive
 * ones with `hidden`), so crawlers still see each route link and price;
 * the folded route guide at the foot of the page spells them out again as
 * sentences for answer engines.
 */
export default function HubRouteList({ place, arrivals, departures, featured = 8, id = "routes" }: Props) {
  const locale = useLocale();
  const hub = DESTINATION_HUB[locale];
  const t = HUB_ROUTE_LIST[locale];
  const baseId = useId();
  const [direction, setDirection] = useState<Direction>(arrivals.length > 0 ? "to" : "from");
  const [tier, setTier] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const both = arrivals.length > 0 && departures.length > 0;
  if (!both && arrivals.length === 0 && departures.length === 0) return null;

  const tierMeta = VEHICLE_TIERS[tier];
  const heading = direction === "to" ? hub.to.heading(place) : hub.from.heading(place);
  const body = direction === "to" ? hub.to.body(place) : hub.from.body(place);

  const segment = (active: boolean) =>
    `rounded-full px-3.5 py-1.5 text-xs font-semibold transition sm:text-sm ${
      active ? "bg-foreground text-white shadow-sm" : "text-foreground/60 hover:text-foreground"
    }`;

  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-24 py-6 md:py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-3xl border border-black/5 bg-white shadow-sm">
          {/* ─── Header: heading, direction, group size ─── */}
          <div className="px-5 py-5 sm:px-8 sm:py-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 id={`${id}-heading`} className="text-xl font-bold text-foreground sm:text-2xl">{heading}</h2>
                <p className="mt-1 hidden text-sm text-foreground/60 md:block">{body}</p>
              </div>
              {both && (
                <div className="inline-flex rounded-full bg-light-surface p-1" role="group" aria-label={t.directionLabel}>
                  {(["to", "from"] as const).map((dir) => (
                    <button
                      key={dir}
                      type="button"
                      aria-pressed={direction === dir}
                      onClick={() => setDirection(dir)}
                      className={segment(direction === dir)}
                    >
                      {dir === "to" ? t.toPlace(place) : t.fromPlace(place)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground/50">{t.groupSize}</span>
              <div className="inline-flex rounded-full bg-light-surface p-1" role="group" aria-label={t.groupSize}>
                {VEHICLE_TIERS.map((v, i) => (
                  <button
                    key={v.key}
                    type="button"
                    aria-pressed={tier === i}
                    onClick={() => setTier(i)}
                    className={segment(tier === i)}
                  >
                    {t.pax(v.minPax, v.maxPax)}
                  </button>
                ))}
              </div>
              <span className="text-xs text-foreground/50">{t.tierNote(tierMeta.minPax, tierMeta.maxPax, tierMeta.name)}</span>
            </div>
          </div>

          {/* ─── Lists: both directions in the HTML, one shown ─── */}
          {(["to", "from"] as const).map((dir) => {
            const list = dir === "to" ? arrivals : departures;
            if (list.length === 0) return null;
            const head = list.slice(0, featured);
            const rest = list.slice(featured);
            const moreId = `${baseId}-${dir}-more`;
            return (
              <div key={dir} hidden={dir !== direction} className="border-t border-black/5">
                <ul className="divide-y divide-black/5">
                  {head.map((r) => (
                    <Row key={r.id} r={r} place={place} tier={tier} t={t} />
                  ))}
                </ul>
                {rest.length > 0 && (
                  <>
                    <ul id={moreId} hidden={!expanded} className="divide-y divide-black/5 border-t border-black/5">
                      {rest.map((r) => (
                        <Row key={r.id} r={r} place={place} tier={tier} t={t} />
                      ))}
                    </ul>
                    <div className="flex flex-col items-center gap-1 border-t border-black/5 px-4 py-4">
                      <button
                        type="button"
                        aria-expanded={expanded}
                        aria-controls={moreId}
                        onClick={() => setExpanded((v) => !v)}
                        className="inline-flex h-11 items-center gap-2 rounded-full border border-black/10 bg-white px-5 text-sm font-bold text-foreground transition hover:border-sunset-orange hover:text-sunset-orange"
                      >
                        {expanded ? t.showLess : t.showMore(rest.length)}
                        <ChevronIcon open={expanded} />
                      </button>
                      {!expanded && <span className="text-xs text-foreground/50">{t.topNote(head.length)}</span>}
                    </div>
                  </>
                )}
              </div>
            );
          })}

          <p className="border-t border-black/5 px-5 py-3 text-xs text-foreground/50 sm:px-8">{t.priceNote}</p>
        </div>
      </div>
    </section>
  );
}

function Row({ r, place, tier, t }: {
  r: PickerRoute;
  place: string;
  tier: number;
  t: (typeof HUB_ROUTE_LIST)["en"];
}) {
  const from = r.direction === "from" ? place : r.other;
  const to = r.direction === "from" ? r.other : place;
  const price = r.prices[tier];
  return (
    <li className="px-4 py-3.5 sm:px-8 sm:py-4">
      <div className="flex items-center gap-3 sm:gap-6">
        <div className="min-w-0 flex-1">
          <Link href={r.href} className="block break-normal text-base font-bold leading-snug text-foreground hover:text-sunset-orange sm:text-lg">
            {/* The end that changes from row to row is the bold one. */}
            <span className={r.direction === "to" ? "" : "text-foreground/50"}>{from}</span>{" "}
            <span className="text-foreground/30">→</span>{" "}
            <span className={r.direction === "from" ? "" : "text-foreground/50"}>{to}</span>
          </Link>
          {r.time && <div className="mt-0.5 text-xs text-foreground/50 sm:text-sm">{r.time}</div>}
        </div>
        <div className="shrink-0 text-right">
          {price ? (
            <span className="block text-2xl font-extrabold leading-none text-sunset-orange sm:text-[1.65rem]">${price}</span>
          ) : (
            <span className="block text-sm font-semibold text-foreground/50">{t.onRequest}</span>
          )}
          <span className="mt-1 block text-[0.65rem] text-foreground/50 sm:text-xs">{t.perVehicle}</span>
        </div>
        <Link
          href={r.href}
          className="inline-flex h-12 shrink-0 items-center rounded-full bg-sunset-orange px-5 text-sm font-bold text-white shadow-md shadow-sunset-orange/20 transition hover:bg-sunset-red"
        >
          {t.book}
        </Link>
      </div>
    </li>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      stroke="currentColor"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  );
}
