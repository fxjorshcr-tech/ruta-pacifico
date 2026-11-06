import Link from "@/components/LocaleLink";
import type { HubGuide } from "@/lib/hubGuide";
import { HUB_GUIDE } from "@/i18n/hubGuide";
import type { Locale } from "@/lib/i18n";

/**
 * The route guide at the foot of a hub page (src/lib/hubGuide.ts): the
 * place's key facts, every route from and to it as one quotable sentence
 * with a Book link, and the booking rules. Folded <details> blocks, closed
 * by default, so a traveller scrolling past sees four lines while
 * crawlers and answer engines read every sentence in the HTML. Server
 * Component, no JavaScript. `#route-guide-facts` is the speakable target
 * in the page's JSON-LD.
 */
export default function HubRouteGuide({ guide, locale }: { guide: HubGuide; locale: Locale }) {
  const t = HUB_GUIDE[locale];
  return (
    <section id="route-guide" aria-labelledby="route-guide-heading" className="mx-auto max-w-4xl scroll-mt-24 px-4 pb-12 sm:px-6 sm:pb-16">
      <h2 id="route-guide-heading" className="text-xl font-bold text-foreground sm:text-2xl">{guide.heading}</h2>
      <p className="mt-2 text-sm text-foreground/60">{guide.intro}</p>

      <div className="mt-5 space-y-3">
        <Fold id="route-guide-facts" heading={guide.factsHeading}>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/80">
            {guide.facts.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </Fold>

        {guide.departures.length > 0 && (
          <Fold id="route-guide-from" heading={guide.departuresHeading}>
            <RouteLines lines={guide.departures} book={t.book} />
          </Fold>
        )}

        {guide.arrivals.length > 0 && (
          <Fold id="route-guide-to" heading={guide.arrivalsHeading}>
            <RouteLines lines={guide.arrivals} book={t.book} />
          </Fold>
        )}

        <Fold id="route-guide-policies" heading={guide.policiesHeading}>
          <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/80">
            {guide.policies.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ol>
        </Fold>
      </div>
    </section>
  );
}

function RouteLines({ lines, book }: { lines: HubGuide["departures"]; book: string }) {
  return (
    <ul className="divide-y divide-black/5 text-sm leading-relaxed text-foreground/80">
      {lines.map((l) => (
        <li key={l.href} className="flex flex-col gap-1 py-2.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
          <span>{l.text}</span>
          <Link href={l.href} className="shrink-0 text-xs font-bold text-sunset-orange hover:text-sunset-red">
            {book} →
          </Link>
        </li>
      ))}
    </ul>
  );
}

function Fold({ id, heading, children }: { id: string; heading: string; children: React.ReactNode }) {
  return (
    <details id={id} className="group scroll-mt-24 rounded-2xl border border-black/5 bg-white shadow-sm">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 sm:px-6 [&::-webkit-details-marker]:hidden">
        <h3 className="text-base font-bold text-foreground">{heading}</h3>
        <svg className="h-5 w-5 shrink-0 text-sunset-orange transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </summary>
      <div className="border-t border-black/5 px-5 py-5 sm:px-6">{children}</div>
    </details>
  );
}
