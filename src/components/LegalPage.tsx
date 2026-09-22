import type { Metadata } from "next";
import Link from "@/components/LocaleLink";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { RESERVATIONS_EMAIL, WHATSAPP_URL } from "@/lib/contact";
import { INTL_LOCALE, OG_LOCALE, localeAlternates, localeUrl, type Locale } from "@/lib/i18n";
import { LEGAL, LEGAL_PATHS, type LegalDocKey } from "@/i18n/legal";

/** Metadata for one of the three legal pages, in the page's language. */
export function legalMetadata(doc: LegalDocKey, locale: Locale): Metadata {
  const t = LEGAL[locale][doc];
  const path = LEGAL_PATHS[doc];
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: localeAlternates(path, locale),
    openGraph: {
      type: "website",
      locale: OG_LOCALE[locale],
      url: localeUrl(locale, path),
      title: t.metaTitle,
      description: t.metaDescription,
    },
  };
}

/** Terms, privacy and refund pages share this layout; only the copy differs. */
export default function LegalPage({ doc, locale }: { doc: LegalDocKey; locale: Locale }) {
  const t = LEGAL[locale][doc];
  const help = LEGAL[locale].help;
  const updated = new Date(`${t.updated}T00:00:00`).toLocaleDateString(INTL_LOCALE[locale], {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="bg-light-surface min-h-screen">
      <SiteNav transparent={false} />
      <article className="mx-auto max-w-3xl px-6 pb-16 pt-28 sm:pt-32">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{t.title}</h1>
        <p className="mt-2 text-sm text-foreground/50">
          {t.updatedLabel}: <time dateTime={t.updated}>{updated}</time>
        </p>
        {t.intro ? (
          <p className="mt-8 text-base leading-relaxed text-foreground/80">{t.intro}</p>
        ) : null}

        <div className="mt-10 space-y-8">
          {t.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="text-lg font-bold text-foreground">{s.heading}</h2>
              {s.paragraphs?.map((p) => (
                <p key={p} className="mt-3 text-[15px] leading-relaxed text-foreground/75">{p}</p>
              ))}
              {s.bullets ? (
                <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-foreground/75">
                  {s.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>

        <aside className="mt-14 rounded-3xl border border-black/5 bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-bold text-foreground">{help.heading}</h2>
          <p className="mt-2 text-sm text-foreground/60">{help.body}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href={WHATSAPP_URL}
              className="inline-flex items-center rounded-full bg-[#25d366] px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
            >
              {help.whatsapp}
            </a>
            <a
              href={`mailto:${RESERVATIONS_EMAIL}`}
              className="inline-flex items-center rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-sunset-orange hover:text-sunset-orange"
            >
              {help.email}
            </a>
          </div>
          <p className="mt-6 text-sm">
            <Link href="/" className="font-semibold text-sunset-orange hover:underline">
              {help.backHome}
            </Link>
          </p>
        </aside>
      </article>
      <SiteFooter locale={locale} />
    </main>
  );
}
