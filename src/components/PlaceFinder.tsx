"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "@/components/LocaleLink";
import HubRoutePicker from "@/components/HubRoutePicker";
import { useLocale } from "@/components/LocaleProvider";
import { DESTINATIONS_INDEX } from "@/i18n/destinationHub";
import type { PickerRoute } from "@/lib/hubPicker";
import { routeSlug } from "@/lib/slug";
import { formatTravelMinutes } from "@/lib/travelMinutes";
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

/**
 * The place finder on /destinations: every origin and destination of the
 * routes table (not only the places with a hub page), a search box that
 * narrows the list as the traveller types, and, once a place is picked,
 * the same route picker the hubs use, with every route from and to it and
 * a Book button per route. A place without a hub page is therefore just
 * as bookable as one with it.
 */
export default function PlaceFinder({ places }: { places: FinderPlace[] }) {
  const locale = useLocale();
  const t = DESTINATIONS_INDEX[locale].finder;
  const inputId = useId();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<FinderPlace | null>(null);
  const [fares, setFares] = useState<FareTuple[] | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const pickerRef = useRef<HTMLDivElement>(null);

  const shortByName = useMemo(() => new Map(places.map((p) => [p.name, p.short])), [places]);
  const visible = useMemo(() => places.filter((p) => matches(query, p)), [places, query]);

  /** Pick a place; the fare file is fetched on the first pick and kept. */
  function select(place: FinderPlace) {
    setSelected(place);
    if (fares || status === "loading") return;
    setStatus("loading");
    loadFares()
      .then((data) => {
        setFares(data);
        setStatus("idle");
      })
      .catch(() => setStatus("error"));
  }

  useEffect(() => {
    if (selected && fares) {
      pickerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selected, fares]);

  const pickerRoutes = useMemo<PickerRoute[]>(() => {
    if (!selected || !fares) return [];
    const byOther = (a: PickerRoute, b: PickerRoute) => a.other.localeCompare(b.other);
    const out: PickerRoute[] = [];
    const back: PickerRoute[] = [];
    fares.forEach(([origen, destino, p1, p2, p3, minutes], idx) => {
      const direction = origen === selected.name ? "from" : destino === selected.name ? "to" : null;
      if (!direction) return;
      const otherName = direction === "from" ? destino : origen;
      const item: PickerRoute = {
        id: idx,
        direction,
        other: shortByName.get(otherName) ?? otherName,
        prices: [p1 || null, p2 || null, p3 || null],
        time: minutes ? formatTravelMinutes(minutes, locale) : "",
        href: `/private-shuttle/${routeSlug(origen, destino)}`,
      };
      (direction === "from" ? out : back).push(item);
    });
    return [...out.sort(byOther), ...back.sort(byOther)];
  }, [selected, fares, shortByName, locale]);

  // Open on the airport pickup when there is one, else the first arrival.
  const defaultRoute =
    pickerRoutes.find((r) => r.direction === "to" && /\bLIR\b/.test(r.other)) ??
    pickerRoutes.find((r) => r.direction === "to") ??
    pickerRoutes[0];

  return (
    <div id="finder" className="scroll-mt-24">
      <label htmlFor={inputId} className="text-sm font-semibold text-foreground/70">
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
                onClick={() => select(p)}
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
          {status === "error" ? (
            <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{t.error}</p>
          ) : !fares ? (
            <p className="rounded-2xl border border-black/5 bg-white px-4 py-6 text-center text-sm text-foreground/60">{t.loading}</p>
          ) : defaultRoute ? (
            <>
              <HubRoutePicker
                key={selected.name}
                place={selected.short}
                routes={pickerRoutes}
                defaultId={defaultRoute.id}
                allRoutesHref="#finder"
              />
              {selected.path && (
                <p className="mt-3 text-sm text-foreground/70">
                  <Link href={selected.path} className="font-semibold text-sunset-orange hover:text-sunset-red">
                    {t.hubLink(selected.short)} →
                  </Link>
                </p>
              )}
            </>
          ) : (
            <p className="rounded-2xl border border-black/5 bg-white px-4 py-6 text-center text-sm text-foreground/60">{t.noRoutes(selected.short)}</p>
          )}
        </div>
      )}
    </div>
  );
}
