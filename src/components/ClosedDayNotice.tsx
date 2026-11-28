import Link from "@/components/LocaleLink";
import type { Locale } from "@/lib/i18n";
import { closedDayCopy, upcomingClosedDays } from "@/lib/closedDay";

/**
 * Notice for the days closed to new bookings (src/lib/closedDay.ts): states
 * the fact, the one exception (Liberia Airport transfers) and that confirmed
 * bookings for those days are not affected. Server component, so it is in
 * the HTML for crawlers; it stops rendering by itself once they have passed.
 */
export default function ClosedDayNotice({
  locale,
  showCta = true,
  className = "",
}: {
  locale: Locale;
  /** Hide the button where the route search is right above. */
  showCta?: boolean;
  className?: string;
}) {
  // The closed days still ahead: each one drops out the day after it passes.
  const dates = upcomingClosedDays();
  if (dates.length === 0) return null;
  const t = closedDayCopy(locale);

  return (
    <section aria-label={t.headline(dates)} className={`mx-auto w-full max-w-7xl px-6 ${className}`}>
      <div className="flex flex-col gap-4 rounded-3xl border border-sunset-orange/25 bg-gradient-to-r from-sunset-gold/15 via-sunset-orange/10 to-white p-6 shadow-sm sm:flex-row sm:items-center sm:gap-6 sm:p-7">
        <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-start">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sunset-orange px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
            {t.tag(dates)}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-base font-bold text-foreground sm:text-lg">{t.headline(dates)}</p>
          <p className="mt-1.5 text-sm leading-relaxed text-foreground/70">{t.body(dates)}</p>
        </div>
        {showCta && (
          <Link
            href="/liberia-airport-shuttle"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sunset-red via-sunset-orange to-sunset-gold px-6 py-3 text-sm font-bold text-white shadow-lg shadow-sunset-orange/25 transition hover:shadow-xl hover:shadow-sunset-orange/40"
          >
            {t.cta}
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        )}
      </div>
    </section>
  );
}
