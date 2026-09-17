import type { Metadata } from "next";

/**
 * Locale routing, mirroring cantwaittravelcr.com: English lives at the root
 * (/prices), Spanish under /es (/es/prices) with identical slugs. Nothing
 * redirects by Accept-Language; visitors switch with the menu control and
 * search engines pick the version from hreflang.
 */
export const LOCALES = ["en", "es"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";
export const BASE_URL = "https://rutapacifico.com";

export function isLocale(value: string | undefined): value is Locale {
  return (LOCALES as readonly string[]).includes(value ?? "");
}

/** "/prices" → "/prices" for English, "/es/prices" for Spanish. */
export function localePath(locale: Locale, path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) return clean;
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}

/** "/es/prices" → { locale: "es", path: "/prices" }; "/prices" → { locale: "en", path: "/prices" }. */
export function splitLocale(pathname: string): { locale: Locale; path: string } {
  const [, first, ...rest] = pathname.split("/");
  if (isLocale(first) && first !== DEFAULT_LOCALE) {
    return { locale: first, path: `/${rest.join("/")}` };
  }
  return { locale: DEFAULT_LOCALE, path: pathname || "/" };
}

/** Absolute URL of a path in a locale. */
export function localeUrl(locale: Locale, path: string): string {
  return `${BASE_URL}${localePath(locale, path)}`;
}

/**
 * Self-referencing canonical plus hreflang alternates for one page. Keys
 * match the sister site so both brands present languages the same way.
 */
export function localeAlternates(
  path: string,
  locale: Locale,
): NonNullable<Metadata["alternates"]> {
  return {
    canonical: localePath(locale, path),
    languages: {
      "en-US": localePath("en", path),
      es: localePath("es", path),
      "x-default": localePath("en", path),
    },
  };
}

export const HTML_LANG: Record<Locale, string> = { en: "en", es: "es" };
export const OG_LOCALE: Record<Locale, string> = { en: "en_US", es: "es_CR" };
/** schema.org `inLanguage` values. */
export const IN_LANGUAGE: Record<Locale, string> = { en: "en-US", es: "es" };
/** For Intl / toLocaleDateString. */
export const INTL_LOCALE: Record<Locale, string> = { en: "en-US", es: "es-CR" };

/**
 * Database rows carry Spanish twins in `*_es` columns. Returns the Spanish
 * value on the Spanish site when it is filled in, the English one otherwise,
 * so an untranslated row never renders empty.
 */
export function pickLocale<T>(locale: Locale, spanish: T | null | undefined, english: T): T {
  return locale === "es" && spanish != null && spanish !== "" ? spanish : english;
}

export type Copy<T> = Record<Locale, T>;

/** A dictionary whose Spanish half must have exactly the English shape. */
export function defineCopy<T>(copy: { en: T; es: T }): Copy<T> {
  return copy;
}

/** Locale from a `[lang]` route param, defaulting to English for anything unexpected. */
export async function localeFromParams(params: Promise<{ lang: string }>): Promise<Locale> {
  const { lang } = await params;
  return isLocale(lang) ? lang : DEFAULT_LOCALE;
}
