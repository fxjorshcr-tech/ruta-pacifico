import Link from "@/components/LocaleLink";
import type { Route } from "@/lib/routes";
import { routeSlug } from "@/lib/slug";
import { PRICE_LIST_PATH, lowestPrice } from "@/lib/pricing";
import { VEHICLE_TIERS } from "@/lib/vehicles";
import type { Locale } from "@/lib/i18n";
import { SHUTTLE } from "@/i18n/shuttle";

/**
 * Server-rendered grid of the most requested airport routes with their
 * starting price. Plain links and text, so crawlers and answer engines that
 * do not run JavaScript get real figures from the booking page and the home
 * page instead of an empty combo-box.
 */
interface Props {
  routes: Route[];
  /** Total number of routes on the price list, for the "see all" link. */
  totalPriced?: number;
  heading?: string;
  eyebrow?: string;
  /** Server component: the page passes the locale it resolved from `params`. */
  locale?: Locale;
}

export default function PopularRoutes({
  routes,
  totalPriced,
  heading,
  eyebrow,
  locale = "en",
}: Props) {
  if (!routes.length) return null;
  const t = SHUTTLE[locale].popular;
  const base = VEHICLE_TIERS[0];

  return (
    <section aria-labelledby="popular-routes" className="mx-auto max-w-5xl px-6 py-16">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-sunset-orange/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-sunset-orange">
          {eyebrow ?? t.eyebrow}
        </div>
        <h2 id="popular-routes" className="mt-4 text-2xl font-bold text-foreground sm:text-3xl">
          {heading ?? t.heading}
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-foreground/60">
          {t.intro(base.minPax, base.maxPax)}
        </p>
      </div>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {routes.map((r) => {
          const price = lowestPrice(r);
          return (
            <li key={r.id}>
              <Link
                href={`/private-shuttle/${routeSlug(r.origen, r.destino)}`}
                className="group flex h-full items-center justify-between gap-4 rounded-2xl border border-black/5 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-sunset-orange/30 hover:shadow-lg"
              >
                <div className="min-w-0">
                  <div className="text-xs font-medium uppercase tracking-wider text-foreground/40">
                    {r.origen}
                  </div>
                  <div className="mt-1 truncate text-base font-bold text-foreground group-hover:text-sunset-orange">
                    {r.destino}
                  </div>
                  <div className="mt-1.5 text-xs text-foreground/50">{t.travelTime(r)}</div>
                </div>
                <div className="shrink-0 text-right leading-none">
                  <div className="text-[0.6rem] font-semibold uppercase tracking-wider text-foreground/40">
                    {t.from}
                  </div>
                  <div className="mt-1 text-2xl font-extrabold text-foreground">
                    {price ? `$${price}` : t.quote}
                  </div>
                  <div className="mt-1 text-[0.65rem] text-foreground/40">{t.perVehicle}</div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-8 text-center">
        <Link
          href={PRICE_LIST_PATH}
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-sunset-orange"
        >
          {totalPriced ? t.seeAllCount(totalPriced) : t.seeAll}
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
