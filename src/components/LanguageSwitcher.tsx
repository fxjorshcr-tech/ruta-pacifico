"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALES, localePath, splitLocale, type Locale } from "@/lib/i18n";
import { useLocale } from "@/components/LocaleProvider";

const LANGUAGES: Record<Locale, { code: string; name: string }> = {
  en: { code: "EN", name: "English" },
  es: { code: "ES", name: "Español" },
};

function Flag({ locale, className = "h-4 w-6" }: { locale: Locale; className?: string }) {
  if (locale === "es") {
    return (
      <svg viewBox="0 0 3 2" className={`${className} shrink-0 rounded-[2px]`} aria-hidden="true">
        <rect width="3" height="2" fill="#AA151B" />
        <rect y="0.5" width="3" height="1" fill="#F1BF00" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 60 40" className={`${className} shrink-0 rounded-[2px]`} aria-hidden="true">
      <rect width="60" height="40" fill="#012169" />
      <path d="M0 0L60 40M60 0L0 40" stroke="#fff" strokeWidth="8" />
      <path d="M0 0L60 40M60 0L0 40" stroke="#C8102E" strokeWidth="4" />
      <path d="M30 0v40M0 20h60" stroke="#fff" strokeWidth="12" />
      <path d="M30 0v40M0 20h60" stroke="#C8102E" strokeWidth="7" />
    </svg>
  );
}

type Props = {
  /** "light" over a dark hero, "dark" on a white bar. */
  tone?: "light" | "dark";
  /** Inline list (mobile menu) instead of the dropdown pill. */
  variant?: "dropdown" | "list";
  onNavigate?: () => void;
};

/**
 * EN / ES control. Links to the same page in the other language so a
 * visitor never loses their place; the locale rewrites and hreflang tags handle the
 * rest (see src/lib/i18n.ts).
 */
export default function LanguageSwitcher({ tone = "light", variant = "dropdown", onNavigate }: Props) {
  const locale = useLocale();
  const pathname = usePathname();
  const { path } = splitLocale(pathname ?? "/");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (variant === "list") {
    return (
      <div className="flex items-center gap-2" role="group" aria-label={locale === "es" ? "Idioma" : "Language"}>
        {LOCALES.map((l) => {
          const active = l === locale;
          return (
            <Link
              key={l}
              href={localePath(l, path)}
              hrefLang={l}
              onClick={onNavigate}
              aria-current={active ? "true" : undefined}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                active
                  ? "border-sunset-orange bg-sunset-orange/10 text-sunset-orange"
                  : tone === "light"
                    ? "border-white/15 text-white/80 hover:border-sunset-gold hover:text-sunset-gold"
                    : "border-black/10 text-foreground/70 hover:border-sunset-orange hover:text-sunset-orange"
              }`}
            >
              <Flag locale={l} />
              {LANGUAGES[l].name}
            </Link>
          );
        })}
      </div>
    );
  }

  const pill =
    tone === "light"
      ? "border-white/30 bg-white/10 text-white hover:border-white/60"
      : "border-black/10 bg-white text-foreground/80 hover:border-sunset-orange hover:text-sunset-orange";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={locale === "es" ? "Cambiar idioma" : "Change language"}
        className={`flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-bold tracking-wide backdrop-blur-sm transition ${pill}`}
      >
        <Flag locale={locale} className="h-3.5 w-5" />
        {LANGUAGES[locale].code}
        <svg
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.2}
          className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-2xl border border-black/5 bg-white py-1.5 shadow-xl"
        >
          {LOCALES.map((l) => {
            const active = l === locale;
            return (
              <Link
                key={l}
                role="menuitem"
                href={localePath(l, path)}
                hrefLang={l}
                onClick={() => {
                  setOpen(false);
                  onNavigate?.();
                }}
                aria-current={active ? "true" : undefined}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm transition ${
                  active
                    ? "font-bold text-sunset-orange"
                    : "font-medium text-foreground/80 hover:bg-sunset-orange/5 hover:text-sunset-orange"
                }`}
              >
                <Flag locale={l} />
                {LANGUAGES[l].name}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
