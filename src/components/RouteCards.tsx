import Link from "@/components/LocaleLink";
import type { Route } from "@/lib/routes";
import { travelTime } from "@/lib/pricing";
import { VEHICLE_TIERS } from "@/lib/vehicles";
import type { Locale } from "@/lib/i18n";

export interface RouteCardItem {
  key: string | number;
  href: string;
  /** Short names of both ends; the highlighted end is bold. */
  from: string;
  to: string;
  highlight: "from" | "to";
  route: Route;
  /** Optional second line, e.g. the return leg on the LIR hub. */
  sub?: { href: string; label: string; price: number | null };
}

interface Props {
  items: RouteCardItem[];
  locale: Locale;
  /** "Book" / "Reservar". */
  book: string;
  /** "on request" / "a consultar". */
  onRequest: string;
  className?: string;
}

/**
 * Phone layout of a hub price table: one card per route with the three
 * things a traveller scans for — the route, the 1–5 passenger fare and the
 * Book button — big, and the rest small. Server Component; the desktop
 * table stays as it is and this list is shown below md instead.
 */
export default function RouteCards({ items, locale, book, onRequest, className = "" }: Props) {
  const [base, ...larger] = VEHICLE_TIERS;
  return (
    <ul className={`divide-y divide-black/5 ${className}`}>
      {items.map((item) => {
        const price = item.route[base.priceField];
        const hasPrice = typeof price === "number" && price > 0;
        return (
          <li key={item.key} className="px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <Link href={item.href} className="block text-base font-bold leading-snug text-foreground">
                  <span className={item.highlight === "from" ? "" : "text-foreground/50"}>{item.from}</span>
                  <span className="mx-1.5 text-foreground/30">→</span>
                  <span className={item.highlight === "to" ? "" : "text-foreground/50"}>{item.to}</span>
                </Link>
                <div className="mt-1 flex items-baseline gap-2">
                  {hasPrice ? (
                    <span className="text-2xl font-extrabold leading-tight text-sunset-orange">${price}</span>
                  ) : (
                    <span className="text-sm text-foreground/50">{onRequest}</span>
                  )}
                  {item.route.duracion && (
                    <span className="text-xs text-foreground/50">{travelTime(item.route, locale)}</span>
                  )}
                </div>
                <div className="mt-1 text-[0.7rem] text-foreground/50">
                  {larger
                    .map((tier) => {
                      const p = item.route[tier.priceField];
                      return `${tier.minPax}–${tier.maxPax} ${typeof p === "number" && p > 0 ? `$${p}` : onRequest}`;
                    })
                    .join(" · ")}
                </div>
              </div>
              <Link
                href={item.href}
                className="inline-flex h-12 shrink-0 items-center rounded-full bg-sunset-orange px-5 text-sm font-bold text-white shadow-md shadow-sunset-orange/20 transition hover:bg-sunset-red"
              >
                {book}
              </Link>
            </div>
            {item.sub && (
              <Link
                href={item.sub.href}
                className="mt-2 flex items-center justify-between rounded-xl bg-light-surface px-3 py-2 text-xs text-foreground/70 hover:text-sunset-orange"
              >
                <span>{item.sub.label}</span>
                <span className="font-bold text-foreground">{item.sub.price !== null ? `$${item.sub.price}` : onRequest}</span>
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}
