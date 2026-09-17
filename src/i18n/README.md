# Bilingual site (EN root, ES under /es)

Every page lives under `src/app/[lang]/`. English is served at the root
(`/prices`), Spanish under `/es` (`/es/prices`) with identical slugs.
`src/proxy.ts` rewrites unprefixed URLs to `/en/...` invisibly and
redirects explicit `/en/...` to the root. Helpers live in `src/lib/i18n.ts`.

## Copy files

One file per page or feature in this folder, e.g. `src/i18n/prices.ts`:

```ts
import { defineCopy } from "@/lib/i18n";

export const PRICES = defineCopy({
  en: { title: "Price list", intro: "...", cta: "Book now" },
  es: { title: "Lista de precios", intro: "...", cta: "Reservar" },
});
```

`defineCopy` types `es` with the exact shape of `en`, so a missing Spanish
key is a type error. Values can be strings, arrays or nested objects; use
functions for interpolation: `from: (price: number) => \`from $${price}\``.

## Server components (pages)

```tsx
import { localeAlternates, localeFromParams, localeUrl, OG_LOCALE, IN_LANGUAGE } from "@/lib/i18n";
import { PRICES } from "@/i18n/prices";

type Params = Promise<{ lang: string }>;            // add `slug: string` on dynamic routes

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const t = PRICES[locale];
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: localeAlternates("/prices", locale),   // self canonical + hreflang en-US / es / x-default
    openGraph: { ..., locale: OG_LOCALE[locale], url: localeUrl(locale, "/prices") },
  };
}

export default async function PricesPage({ params }: { params: Params }) {
  const locale = await localeFromParams(params);
  const t = PRICES[locale];
  ...
}
```

* Replace `export const metadata` with `generateMetadata` as above.
* JSON-LD: `inLanguage: IN_LANGUAGE[locale]`, page URLs via `localeUrl(locale, path)`.
* Dates: `toLocaleDateString(INTL_LOCALE[locale], ...)`.
* Keep `export const revalidate`, `generateStaticParams` and all data logic as they are.

## Links

`import Link from "@/components/LocaleLink";` instead of `next/link` for
internal links. Same API; `/prices` becomes `/es/prices` on the Spanish
site automatically. External URLs, `mailto:`, `#anchors` pass through.
Plain `<a href="/...">` internal anchors must also go through `LocaleLink`
or `localePath(locale, "/...")`.

## Client components

```tsx
"use client";
import { useLocale } from "@/components/LocaleProvider";
import { BOOKING } from "@/i18n/booking";

const locale = useLocale();
const t = BOOKING[locale];
```

## Writing the Spanish

* Costa Rican Spanish, **tú** form ("Reserva tu shuttle"), same voice as
  cantwaittravelcr.com/es. Natural marketing copy, not literal.
* Terminology: *shuttle privado*, *traslado*, *chofer*, *aeropuerto de
  Liberia (LIR)*, *precio fijo*, *puerta a puerta*, *seguimiento de vuelo*,
  *sillas para niños*, *Reservar*, *Nosotros y Contacto*, *Preguntas frecuentes*.
* Never translate: Ruta Pacifico, WhatsApp, LIR, SJO, route and hotel
  names from the database (`origen`, `destino`), prices, the licence number.
* English strings stay byte-identical to what the page had before; the
  refactor must not change the English site.
* Titles and meta descriptions in Spanish are written for Spanish search
  intent ("shuttle aeropuerto Liberia", "traslado privado Tamarindo"),
  not translated word by word.

## Database content

Spanish twins of database copy live in `*_es` columns
(`supabase/i18n_es_schema.sql`). Readers select both and pick with
`pickLocalized(row, "answer", locale)` semantics: Spanish when present,
English otherwise, so an untranslated row never renders empty.
