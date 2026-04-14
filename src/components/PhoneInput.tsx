"use client";

import { useEffect, useMemo, useRef, useState } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  id?: string;
}

interface Country {
  code: string; // ISO2 (unique key)
  dial: string;
  flag: string;
  name: string;
}

const COUNTRIES: Country[] = [
  { code: "US", dial: "+1", flag: "🇺🇸", name: "United States" },
  { code: "CA", dial: "+1", flag: "🇨🇦", name: "Canada" },
  { code: "CR", dial: "+506", flag: "🇨🇷", name: "Costa Rica" },
  { code: "MX", dial: "+52", flag: "🇲🇽", name: "Mexico" },
  { code: "GB", dial: "+44", flag: "🇬🇧", name: "United Kingdom" },
  { code: "IE", dial: "+353", flag: "🇮🇪", name: "Ireland" },
  { code: "DE", dial: "+49", flag: "🇩🇪", name: "Germany" },
  { code: "FR", dial: "+33", flag: "🇫🇷", name: "France" },
  { code: "ES", dial: "+34", flag: "🇪🇸", name: "Spain" },
  { code: "IT", dial: "+39", flag: "🇮🇹", name: "Italy" },
  { code: "NL", dial: "+31", flag: "🇳🇱", name: "Netherlands" },
  { code: "BE", dial: "+32", flag: "🇧🇪", name: "Belgium" },
  { code: "CH", dial: "+41", flag: "🇨🇭", name: "Switzerland" },
  { code: "AT", dial: "+43", flag: "🇦🇹", name: "Austria" },
  { code: "SE", dial: "+46", flag: "🇸🇪", name: "Sweden" },
  { code: "NO", dial: "+47", flag: "🇳🇴", name: "Norway" },
  { code: "DK", dial: "+45", flag: "🇩🇰", name: "Denmark" },
  { code: "FI", dial: "+358", flag: "🇫🇮", name: "Finland" },
  { code: "PT", dial: "+351", flag: "🇵🇹", name: "Portugal" },
  { code: "BR", dial: "+55", flag: "🇧🇷", name: "Brazil" },
  { code: "AR", dial: "+54", flag: "🇦🇷", name: "Argentina" },
  { code: "CO", dial: "+57", flag: "🇨🇴", name: "Colombia" },
  { code: "CL", dial: "+56", flag: "🇨🇱", name: "Chile" },
  { code: "PE", dial: "+51", flag: "🇵🇪", name: "Peru" },
  { code: "PA", dial: "+507", flag: "🇵🇦", name: "Panama" },
  { code: "AU", dial: "+61", flag: "🇦🇺", name: "Australia" },
  { code: "NZ", dial: "+64", flag: "🇳🇿", name: "New Zealand" },
  { code: "JP", dial: "+81", flag: "🇯🇵", name: "Japan" },
];

function parseInitial(raw: string): { code: string; number: string } {
  if (!raw) return { code: "US", number: "" };
  const m = raw.match(/^(\+\d+)\s*(.*)$/);
  if (m) {
    const country = COUNTRIES.find((c) => c.dial === m[1]);
    return {
      code: country?.code ?? "US",
      number: m[2] ?? "",
    };
  }
  return { code: "US", number: raw };
}

export default function PhoneInput({ value, onChange, required, id }: Props) {
  const [countryCode, setCountryCode] = useState(
    () => parseInitial(value).code
  );
  const [number, setNumber] = useState(() => parseInitial(value).number);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  const country =
    COUNTRIES.find((c) => c.code === countryCode) ?? COUNTRIES[0];

  function emit(newCode: string, newNumber: string) {
    const c = COUNTRIES.find((cc) => cc.code === newCode) ?? COUNTRIES[0];
    onChange(newNumber ? `${c.dial} ${newNumber}` : "");
  }

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dial.replace("+", "").includes(q.replace("+", "")) ||
        c.code.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div ref={wrapperRef} className="relative">
      <div
        className={`flex overflow-hidden rounded-xl border transition ${
          open
            ? "border-sunset-orange bg-white ring-2 ring-sunset-orange/20"
            : "border-black/10 bg-light-surface focus-within:border-sunset-orange focus-within:bg-white focus-within:ring-2 focus-within:ring-sunset-orange/20"
        }`}
      >
        {/* Country code button */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex shrink-0 items-center gap-2 border-r border-black/10 bg-white/60 px-3 text-sm transition hover:bg-sunset-orange/5"
          aria-label="Select country code"
        >
          <span className="text-lg leading-none">{country.flag}</span>
          <span className="font-mono text-sm font-semibold text-foreground">
            {country.dial}
          </span>
          <svg
            className={`h-3 w-3 text-foreground/40 transition ${
              open ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m19.5 8.25-7.5 7.5-7.5-7.5"
            />
          </svg>
        </button>

        {/* Number input */}
        <input
          id={id}
          type="tel"
          required={required}
          placeholder="Phone number"
          value={number}
          onChange={(e) => {
            const n = e.target.value;
            setNumber(n);
            emit(countryCode, n);
          }}
          className="w-full bg-transparent px-4 py-3 text-sm text-foreground outline-none"
        />
      </div>

      {/* Country dropdown */}
      {open && (
        <div className="absolute left-0 top-full z-30 mt-2 w-full min-w-[260px] rounded-xl border border-black/5 bg-white p-2 shadow-2xl sm:w-80">
          <div className="mb-2 p-1">
            <input
              type="text"
              placeholder="Search country or code…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              className="w-full rounded-lg border border-black/10 bg-light-surface px-3 py-2 text-sm outline-none transition focus:border-sunset-orange focus:bg-white focus:ring-2 focus:ring-sunset-orange/20"
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-foreground/40">
                No match
              </div>
            ) : (
              filtered.map((c) => {
                const active = c.code === countryCode;
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => {
                      setCountryCode(c.code);
                      emit(c.code, number);
                      setOpen(false);
                      setQuery("");
                    }}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition ${
                      active
                        ? "bg-sunset-orange/10 text-sunset-orange"
                        : "text-foreground hover:bg-sunset-orange/5"
                    }`}
                  >
                    <span className="text-lg leading-none">{c.flag}</span>
                    <span className="flex-1 font-medium">{c.name}</span>
                    <span className="font-mono text-xs text-foreground/50">
                      {c.dial}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
