"use client";

import { useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import Link from "@/components/LocaleLink";
import HubRoutePicker from "@/components/HubRoutePicker";
import { useLocale } from "@/components/LocaleProvider";
import { DESTINATIONS_INDEX } from "@/i18n/destinationHub";
import { getCart } from "@/lib/booking";
import type { PickerRoute } from "@/lib/hubPicker";
import { routeSlug } from "@/lib/slug";
import { formatTravelMinutes } from "@/lib/travelMinutes";
import { VEHICLE_TIERS } from "@/lib/vehicles";
import type { FareTuple } from "@/app/fares.json/route";

/** One place of the routes table, as the server lists it for the finder. */
export interface FinderPlace {
  /** Exact routes-table value: "Playa Hermosa (Guanacaste)". */
  name: string;
  /** Display name: "Playa Hermosa". */
  short: string;
  /** Hub page when the place has one ("/tamarindo-shuttle"), else null. */
  path: string | null;
  /** Priced routes that start or end here. */
  routes: number;
  /** Airports lead the list. */
  airport: boolean;
}

type Direction = PickerRoute["direction"];

const FARES_PATH = "/fares.json";
let faresPromise: Promise<FareTuple[]> | null = null;

/** The fare file, fetched once per page and shared by every selection. */
function loadFares(): Promise<FareTuple[]> {
  if (!faresPromise) {
    faresPromise = fetch(FARES_PATH)
      .then((res) => {
        if (!res.ok) throw new Error(`fares.json ${res.status}`);
        return res.json() as Promise<FareTuple[]>;
      })
      .catch((err) => {
        faresPromise = null;
        throw err;
      });
  }
  return faresPromise;
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Every typed word starts a word of the place name; falls back to a substring match. */
function matches(query: string, place: FinderPlace): boolean {
  const q = normalize(query);
  if (!q) return true;
  const hay = normalize(`${place.short} ${place.name}`);
  const words = hay.split(" ");
  const tokens = q.split(" ");
  if (tokens.every((tok) => words.some((w) => w.startsWith(tok)))) return true;
  return hay.includes(q);
}

function subscribeCart(cb: () => void): () => void {
  window.addEventListener("storage", cb);
  window.addEventListener("rp-cart-change", cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener("rp-cart-change", cb);
  };
}
const cartHasItems = () => getCart().length > 0;
const cartServerSnapshot = () => false;

/**
 * The guided booking flow on /destinations. It greets the traveller with
 * "Where does your first shuttle start?" (or "your next shuttle" once the
 * trip has a leg), lists every origin and destination of the routes table
 * (airports first, a search box narrows the list as they type), and, once
 * a place is picked, shows every route from and to it with a Book button
 * per route: a grid of cards on a laptop, the compact picker (fixed place,
 * native select) on a phone. `?from=<place>` preselects the origin, which
 * is how the route page sends people back for their next leg.
 */
export default function PlaceFinder({ places }: { places: FinderPlace[] }) {
  const locale = useLocale();
  const t = DESTINATIONS_INDEX[locale].finder;
  const inputId = useId();
  const fromParam = useSearchParams().get("from");
  const hasTrip = useSyncExternalStore(subscribeCart, cartHasItems, cartServerSnapshot);

  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<FinderPlace | null>(
    () => (fromParam ? places.find((p) => p.name === fromParam) ?? null : null),
  );
  const [direction, setDirection] = useState<Direction | null>(null);
  const [fares, setFares] = useState<FareTuple[] | null>(null);
  const [failed, setFailed] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  const shortByName = useMemo(() => new Map(places.map((p) => [p.name, p.short])), [places]);
  const visible = useMemo(() => places.filter((p) => matches(query, p)), [places, query]);

  // Fares are fetched on the first pick (or on arrival with ?from=) and kept.
  useEffect(() => {
    if (!selected || fares) return;
    let cancelled = false;
    loadFares()
      .then((data) => {
        if (!cancelled) setFares(data);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [selected, fares]);

  // Arriving with ?from=: land on the finder, not the hero.
  useEffect(() => {
    if (fromParam) rootRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [fromParam]);

  useEffect(() => {
    if (selected && fares) pickerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [selected, fares]);

  const pickerRoutes = useMemo<PickerRoute[]>(() => {
    if (!selected || !fares) return [];
    const byOther = (a: PickerRoute, b: PickerRoute) => a.other.localeCompare(b.other);
    const out: PickerRoute[] = [];
    const back: PickerRoute[] = [];
    fares.forEach(([origen, destino, p1, p2, p3, minutes], idx) => {
      const dir: Direction | null = origen === selected.name ? "from" : destino === selected.name ? "to" : null;
      if (!dir) return;
      const otherName = dir === "from" ? destino : origen;
      const item: PickerRoute = {
        id: idx,
        direction: dir,
        other: shortByName.get(otherName) ?? otherName,
        prices: [p1 || null, p2 || null, p3 || null],
        time: minutes ? formatTravelMinutes(minutes, locale) : "",
        href: `/private-shuttle/${routeSlug(origen, destino)}`,
      };
      (dir === "from" ? out : back).push(item);
    });
    return [...out.sort(byOther), ...back.sort(byOther)];
  }, [selected, fares, shortByName, locale]);

  const departures = pickerRoutes.filter((r) => r.direction === "from");
  const arrivals = pickerRoutes.filter((r) => r.direction === "to");

  // The place is an ORIGIN by default (the question asked); when it sells
  // no departures, show the arrivals. The airport pickup leads the phone
  // picker when the place was reached without a direction in mind.
  const activeDirection: Direction =
    direction ?? (departures.length > 0 ? "from" : "to");
  const gridRoutes = activeDirection === "from" ? departures : arrivals;
  const defaultRoute =
    (activeDirection === "from"
      ? departures.find((r) => /\bLIR\b/.test(r.other)) ?? departures[0]
      : arrivals.find((r) => /\bLIR\b/.test(r.other)) ?? arrivals[0]) ?? pickerRoutes[0];

  function pick(place: FinderPlace) {
    setSelected(place);
    setDirection(null);
    setFailed(false);
  }

  const larger = (r: PickerRoute) =>
    VEHICLE_TIERS.slice(1)
      .map((tier, i) => `${tier.minPax}–${tier.maxPax} ${r.prices[i + 1] ? `$${r.prices[i + 1]}` : t.onRequest}`)
      .join(" · ");

  return (
    <div id="finder" ref={rootRef} className="scroll-mt-24">
      <h2 id="finder-heading" className="text-2xl font-bold text-foreground sm:text-3xl">
        {hasTrip ? t.headingNext : t.headingFirst}
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-foreground/60 sm:text-base">{t.body}</p>

      <label htmlFor={inputId} className="mt-6 block text-sm font-semibold text-foreground/70">
        {t.label}
      </label>
      <div className="relative mt-2">
        <svg className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/40" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <input
          id={inputId}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.placeholder}
          autoComplete="off"
          enterKeyHint="search"
          className="h-14 w-full rounded-2xl border border-black/10 bg-white pl-12 pr-4 text-base font-medium text-foreground shadow-sm outline-none transition focus:border-sunset-orange focus:ring-2 focus:ring-sunset-orange/30"
        />
      </div>
      <p className="mt-2 text-xs text-foreground/50">{visible.length ? t.count(visible.length, places.length) : t.noMatch}</p>

      <ul className="mt-4 flex flex-wrap gap-2" aria-label={t.allPlaces}>
        {visible.map((p) => {
          const active = selected?.name === p.name;
          return (
            <li key={p.name}>
              <button
                type="button"
                onClick={() => pick(p)}
                aria-pressed={active}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-semibold transition ${
                  active
                    ? "border-sunset-orange bg-sunset-orange text-white shadow-md"
                    : p.airport
                      ? "border-sunset-orange/40 bg-white text-foreground hover:border-sunset-orange"
                      : "border-black/10 bg-white text-foreground/80 hover:border-sunset-orange hover:text-sunset-orange"
                }`}
              >
                {p.short}
                <span className={`text-[0.65rem] font-medium ${active ? "text-white/80" : "text-foreground/40"}`}>{p.routes}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {selected && (
        <div ref={pickerRef} className="mt-6 scroll-mt-24">
          {failed ? (
            <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{t.error}</p>
          ) : !fares ? (
            <p className="rounded-2xl border border-black/5 bg-white px-4 py-6 text-center text-sm text-foreground/60">{t.loading}</p>
          ) : !defaultRoute ? (
            <p className="rounded-2xl border border-black/5 bg-white px-4 py-6 text-center text-sm text-foreground/60">{t.noRoutes(selected.short)}</p>
          ) : (
            <>
              {/* Phones: the compact picker (fixed place, native select, sticky bar). */}
              <div className="lg:hidden">
                <HubRoutePicker
                  key={`${selected.name}-${activeDirection}`}
                  place={selected.short}
                  routes={pickerRoutes}
                  defaultId={defaultRoute.id}
                  allRoutesHref="#finder"
                />
              </div>

              {/* Laptops: every route of the chosen direction open as cards. */}
              <div className="hidden lg:block">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-lg font-bold text-foreground">
                    {activeDirection === "from" ? t.gridFrom(selected.short) : t.gridTo(selected.short)}
                    <span className="ml-2 text-sm font-medium text-foreground/50">{t.routesCount(gridRoutes.length)}</span>
                  </h3>
                  {departures.length > 0 && arrivals.length > 0 && (
                    <div className="inline-flex rounded-full bg-white p-1 text-xs font-semibold shadow-sm" role="group" aria-label={t.directionLabel}>
                      {(["from", "to"] as const).map((dir) => (
                        <button
                          key={dir}
                          type="button"
                          aria-pressed={activeDirection === dir}
                          onClick={() => setDirection(dir)}
                          className={`rounded-full px-3.5 py-1.5 transition ${
                            activeDirection === dir ? "bg-foreground text-white shadow-sm" : "text-foreground/60 hover:text-foreground"
                          }`}
                        >
                          {dir === "from" ? t.fromPlace(selected.short) : t.toPlace(selected.short)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <ul className="mt-4 grid gap-3 lg:grid-cols-3 xl:grid-cols-4">
                  {gridRoutes.map((r) => (
                    <li key={r.id}>
                      <Link
                        href={r.href}
                        className="group flex h-full flex-col justify-between rounded-2xl border border-black/5 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-sunset-orange/40 hover:shadow-md"
                      >
                        <div>
                          <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-foreground/40">
                            {activeDirection === "from" ? `${selected.short} →` : `→ ${selected.short}`}
                          </div>
                          <div className="mt-0.5 text-base font-bold text-foreground group-hover:text-sunset-orange">{r.other}</div>
                          {r.time && <div className="mt-1 text-xs text-foreground/50">{r.time}</div>}
                        </div>
                        <div className="mt-4 flex items-end justify-between gap-2">
                          <div>
                            <span className="text-2xl font-extrabold leading-none text-sunset-orange">
                              {r.prices[0] ? `$${r.prices[0]}` : t.onRequest}
                            </span>
                            <div className="mt-1 text-[0.65rem] text-foreground/50">{larger(r)}</div>
                          </div>
                          <span className="inline-flex h-10 items-center rounded-full bg-foreground px-4 text-xs font-bold text-white transition group-hover:bg-sunset-orange">
                            {t.book}
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {selected.path && (
                <p className="mt-4 text-sm text-foreground/70">
                  <Link href={selected.path} className="font-semibold text-sunset-orange hover:text-sunset-red">
                    {t.hubLink(selected.short)} →
                  </Link>
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
