"use client";

import { useEffect, useState } from "react";
import Link from "@/components/LocaleLink";
import { useLocale } from "@/components/LocaleProvider";
import { HUB_MOBILE_BAR } from "@/i18n/destinationHub";
import { getCart } from "@/lib/booking";

interface Props {
  /** Short names of both ends, e.g. "LIR" and "Tamarindo". */
  from: string;
  to: string;
  /** 1–5 passenger fare of that route, when published. */
  price: number | null;
  /** Route page the Book button opens. */
  href: string;
  /** In-page anchor of the arrivals table. */
  allRoutesHref: string;
}

/**
 * Phone-only sticky booking bar for the hub pages: the one route most
 * visitors came for (airport → destination), its price and a Book button
 * that stays on screen while they scroll. Hidden on lg+ where the tables
 * and their buttons are visible, and whenever the cart pill
 * (FloatingCart) is showing, which owns the same corner of the screen.
 */
export default function HubMobileBar({ from, to, price, href, allRoutesHref }: Props) {
  const locale = useLocale();
  const t = HUB_MOBILE_BAR[locale];
  const [cartHasItems, setCartHasItems] = useState(false);

  useEffect(() => {
    function sync() {
      setCartHasItems(getCart().length > 0);
    }
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("rp-cart-change", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("rp-cart-change", sync);
    };
  }, []);

  if (cartHasItems) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-white/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur-sm lg:hidden"
      role="region"
      aria-label={t.label}
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-bold text-foreground">
            {from} <span className="text-foreground/30">→</span> {to}
          </div>
          <div className="flex items-baseline gap-2">
            {price !== null ? (
              <>
                <span className="text-2xl font-extrabold leading-tight text-sunset-orange">${price}</span>
                <span className="text-[0.65rem] text-foreground/50">{t.perVehicle}</span>
              </>
            ) : (
              <span className="text-xs text-foreground/50">{t.onRequest}</span>
            )}
            <a href={allRoutesHref} className="ml-auto text-xs font-semibold text-foreground/60 underline-offset-2 hover:text-sunset-orange hover:underline">
              {t.allRoutes}
            </a>
          </div>
        </div>
        <Link
          href={href}
          className="inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-sunset-orange px-6 text-sm font-bold text-white shadow-lg shadow-sunset-orange/25 transition hover:bg-sunset-red"
        >
          {t.book}
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
