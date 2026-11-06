"use client";

import { useEffect, useId, useMemo, useState } from "react";
import Link from "@/components/LocaleLink";
import { useLocale } from "@/components/LocaleProvider";
import { HUB_ROUTE_PICKER } from "@/i18n/destinationHub";
import { getCart } from "@/lib/booking";
import type { PickerRoute } from "@/lib/hubPicker";
import { VEHICLE_TIERS } from "@/lib/vehicles";

interface Props {
  /** Short name of the place the hub is about: "LIR", "Tamarindo". */
  place: string;
  /** Every priced route of the hub, from src/lib/hubPicker.ts. */
  routes: PickerRoute[];
  /** The route selected on arrival: the airport pickup, usually. */
  defaultId: number;
  /** In-page anchor of the first price table, for the "All routes" link. */
  allRoutesHref: string;
}

type Direction = PickerRoute["direction"];

/**
 * The booking widget of a hub page: the hub place on one side, a native
 * <select> with every other end on the other, the fare for the chosen
 * route and a Book button that opens its page. The select is deliberately
 * the browser's own control: on an iPhone it opens the wheel picker, on
 * Android the sheet, on a laptop the list, with no JavaScript needed for
 * the menu itself and full keyboard and screen-reader support for free.
 *
 * Rendered twice from one state: an inline card where the component is
 * placed, and a sticky bar at the bottom of phone screens (hidden on lg+
 * where the card and the tables are in view, and whenever the cart pill
 * owns that corner).
 */
export default function HubRoutePicker({ place, routes, defaultId, allRoutesHref }: Props) {
  const locale = useLocale();
  const t = HUB_ROUTE_PICKER[locale];
  const cardSelectId = useId();
  const barSelectId = useId();
  const [selectedId, setSelectedId] = useState(defaultId);
  const [cartHasItems, setCartHasItems] = useState(false);

  useEffect(() => {
    function sync() {
      setCartHasItems(getCart().length > 0);
    }
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("rp-cart-change", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("rp-cart-change", sync);
    };
  }, []);

  const selected = useMemo(
    () => routes.find((r) => r.id === selectedId) ?? routes[0],
    [routes, selectedId],
  );
  const departures = useMemo(() => routes.filter((r) => r.direction === "from"), [routes]);
  const arrivals = useMemo(() => routes.filter((r) => r.direction === "to"), [routes]);

  if (!selected) return null;

  const direction = selected.direction;
  const sameDirection = direction === "from" ? departures : arrivals;

  /** Flip direction, keeping the same town when the reverse route is sold. */
  function setDirection(next: Direction) {
    if (next === direction) return;
    const list = next === "from" ? departures : arrivals;
    const twin = list.find((r) => r.other === selected.other);
    const target = twin ?? list[0];
    if (target) setSelectedId(target.id);
  }

  const optionLabel = (r: PickerRoute) => (r.prices[0] ? `${r.other} · $${r.prices[0]}` : r.other);
  const base = selected.prices[0];
  const larger = VEHICLE_TIERS.slice(1)
    .map((tier, i) => `${t.pax(tier.minPax, tier.maxPax)} ${selected.prices[i + 1] ? `$${selected.prices[i + 1]}` : t.onRequest}`)
    .join(" · ");
  const fromName = direction === "from" ? place : selected.other;
  const toName = direction === "from" ? selected.other : place;

  const fixedBox = (
    <div className="flex min-h-[3.25rem] items-center rounded-2xl border border-black/10 bg-light-surface px-4 text-base font-bold text-foreground">
      {place}
    </div>
  );

  return (
    <>
      {/* ─── Inline card ─── */}
      <div className="rounded-3xl border border-black/5 bg-white p-4 shadow-sm sm:p-6" role="region" aria-label={t.label}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-bold text-foreground sm:text-lg">{t.heading}</h2>
          {departures.length > 0 && arrivals.length > 0 && (
            <div className="inline-flex rounded-full bg-light-surface p-1 text-xs font-semibold" role="group" aria-label={t.directionLabel}>
              {(["from", "to"] as const).map((dir) => (
                <button
                  key={dir}
                  type="button"
                  aria-pressed={direction === dir}
                  onClick={() => setDirection(dir)}
                  className={`rounded-full px-3.5 py-1.5 transition ${
                    direction === dir ? "bg-foreground text-white shadow-sm" : "text-foreground/60 hover:text-foreground"
                  }`}
                >
                  {dir === "from" ? t.fromPlace(place) : t.toPlace(place)}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
          <div>
            <div className="mb-1.5 text-[0.65rem] font-semibold uppercase tracking-wider text-foreground/50">{t.from}</div>
            {direction === "from" ? fixedBox : (
              <RouteSelect id={cardSelectId} label={t.selectLabel} value={selected.id} onChange={setSelectedId} options={sameDirection} optionLabel={optionLabel} />
            )}
          </div>
          <div className="hidden pb-4 text-foreground/30 sm:block" aria-hidden="true">
            <ArrowIcon className="h-5 w-5" />
          </div>
          <div>
            <div className="mb-1.5 text-[0.65rem] font-semibold uppercase tracking-wider text-foreground/50">{t.to}</div>
            {direction === "to" ? fixedBox : (
              <RouteSelect id={cardSelectId} label={t.selectLabel} value={selected.id} onChange={setSelectedId} options={sameDirection} optionLabel={optionLabel} />
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 border-t border-black/5 pt-4 sm:flex-row sm:items-center sm:gap-6">
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2">
              {base ? (
                <>
                  <span className="text-3xl font-extrabold leading-none text-sunset-orange">${base}</span>
                  <span className="text-xs text-foreground/50">{t.perVehicle}</span>
                </>
              ) : (
                <span className="text-sm font-semibold text-foreground/60">{t.onRequest}</span>
              )}
            </div>
            <div className="mt-1.5 text-xs text-foreground/60">
              {selected.time && (
                <>
                  <span className="font-semibold text-foreground">{selected.time}</span>
                  <span className="mx-1.5 text-foreground/30">·</span>
                </>
              )}
              {larger}
            </div>
          </div>
          <Link
            href={selected.href}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-sunset-orange px-6 text-sm font-bold text-white shadow-md shadow-sunset-orange/25 transition hover:bg-sunset-red sm:w-auto"
          >
            {t.bookRoute}
            <ArrowIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* ─── Phone sticky bar ─── */}
      {!cartHasItems && (
        <div
          className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-white/95 px-4 pt-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur-sm lg:hidden"
          role="region"
          aria-label={t.label}
        >
          <div className="flex items-center gap-2">
            <span className="shrink-0 text-sm font-bold text-foreground">{fromName}</span>
            <span className="shrink-0 text-foreground/30" aria-hidden="true">→</span>
            <div className="min-w-0 flex-1">
              <label htmlFor={barSelectId} className="sr-only">{t.selectLabel}</label>
              <div className="relative">
                <select
                  id={barSelectId}
                  value={selected.id}
                  onChange={(e) => setSelectedId(Number(e.target.value))}
                  className="h-11 w-full appearance-none truncate rounded-xl border border-black/10 bg-light-surface pl-3 pr-9 text-sm font-bold text-foreground outline-none focus:border-sunset-orange focus:ring-2 focus:ring-sunset-orange/30"
                >
                  {departures.length > 0 && (
                    <optgroup label={t.fromPlace(place)}>
                      {departures.map((r) => (
                        <option key={r.id} value={r.id}>{optionLabel(r)}</option>
                      ))}
                    </optgroup>
                  )}
                  {arrivals.length > 0 && (
                    <optgroup label={t.toPlace(place)}>
                      {arrivals.map((r) => (
                        <option key={r.id} value={r.id}>{optionLabel(r)}</option>
                      ))}
                    </optgroup>
                  )}
                </select>
                <ChevronIcon />
              </div>
            </div>
            <Link
              href={selected.href}
              className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full bg-sunset-orange px-4 text-sm font-bold text-white shadow-lg shadow-sunset-orange/25 transition hover:bg-sunset-red"
            >
              {t.book}
              <ArrowIcon className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-1.5 flex items-baseline gap-2 overflow-hidden whitespace-nowrap text-xs text-foreground/60">
            <span className="sr-only">{fromName} → {toName}:</span>
            {base ? (
              <>
                <span className="text-lg font-extrabold leading-none text-sunset-orange">${base}</span>
                <span className="shrink-0">{t.perVehicleShort}</span>
              </>
            ) : (
              <span className="shrink-0">{t.onRequest}</span>
            )}
            {selected.time && <span className="min-w-0 truncate">· {selected.time}</span>}
            <a href={allRoutesHref} className="ml-auto shrink-0 font-semibold text-foreground/60 underline-offset-2 hover:text-sunset-orange hover:underline">
              {t.allRoutes}
            </a>
          </div>
        </div>
      )}
    </>
  );
}

function RouteSelect({ id, label, value, onChange, options, optionLabel }: {
  id: string;
  label: string;
  value: number;
  onChange: (id: number) => void;
  options: PickerRoute[];
  optionLabel: (r: PickerRoute) => string;
}) {
  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">{label}</label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-[3.25rem] w-full appearance-none truncate rounded-2xl border border-black/10 bg-white pl-4 pr-11 text-base font-bold text-foreground outline-none transition focus:border-sunset-orange focus:ring-2 focus:ring-sunset-orange/30"
      >
        {options.map((r) => (
          <option key={r.id} value={r.id}>{optionLabel(r)}</option>
        ))}
      </select>
      <ChevronIcon />
    </div>
  );
}

function ChevronIcon() {
  return (
    <svg
      className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-sunset-orange"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={3}
      stroke="currentColor"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

function ArrowIcon({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
  );
}
