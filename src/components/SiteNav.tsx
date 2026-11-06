"use client";

import { useRef } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LOGO_URL } from "@/lib/brand";
import { splitLocale } from "@/lib/i18n";
import { NAV } from "@/i18n/site";
import { useLocale } from "@/components/LocaleProvider";
import Link from "@/components/LocaleLink";
import LanguageSwitcher from "@/components/LanguageSwitcher";

interface Props {
  /**
   * When true, nav is absolutely positioned over a hero with a transparent
   * background and light text. When false, nav is solid white with dark text.
   */
  transparent?: boolean;
}

export default function SiteNav({ transparent = true }: Props) {
  const locale = useLocale();
  const t = NAV[locale];
  const pathname = usePathname();
  const isHome = splitLocale(pathname ?? "/").path === "/";
  // The phone menu is a native <details>: the burger is its <summary>, so
  // it opens and its links work as soon as the HTML arrives, before the
  // JavaScript has downloaded or React has hydrated. After hydration the
  // ref closes it when a link is tapped (client-side navigation keeps the
  // page, so the panel would otherwise stay open).
  const menuRef = useRef<HTMLDetailsElement>(null);
  const closeMenu = () => {
    if (menuRef.current) menuRef.current.open = false;
  };

  const containerClass = transparent
    ? "absolute top-0 z-50 w-full"
    : "sticky top-0 z-50 w-full border-b border-black/5 bg-white/95 backdrop-blur-sm";

  const linkClass = transparent
    ? "text-white/90 hover:text-sunset-gold"
    : "text-foreground/80 hover:text-sunset-orange";

  const hamburgerBar = transparent ? "bg-white" : "bg-foreground";

  const mobileMenuClass = transparent
    ? "bg-black/90 backdrop-blur-md"
    : "bg-white border-b border-black/5";

  const mobileLinkClass = transparent
    ? "text-white/90 hover:bg-white/5 hover:text-sunset-gold"
    : "text-foreground/80 hover:bg-sunset-orange/5 hover:text-sunset-orange";

  const links: { href: string; label: string }[] = [
    ...(isHome ? [] : [{ href: "/", label: t.home }]),
    { href: "/private-shuttle", label: t.shuttles },
    { href: "/liberia-airport-shuttle", label: t.liberiaAirport },
    { href: "/destinations", label: t.destinations },
    { href: "/prices", label: t.prices },
    // Blog and About & Contact live in the footer only, so the bar stays
    // about the five things a traveller books with.
  ];

  return (
    <nav className={containerClass}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 sm:py-5">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center" aria-label={t.logoLabel}>
          <Image
            src={LOGO_URL}
            alt="Ruta Pacifico"
            width={360}
            height={150}
            className="h-12 w-auto sm:h-14 lg:h-16"
            loading="eager"
          />
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 lg:flex xl:gap-10">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-[0.95rem] font-bold tracking-wide transition ${linkClass}`}
            >
              {item.label}
            </Link>
          ))}
          <LanguageSwitcher tone={transparent ? "light" : "dark"} />
        </div>

        {/* Mobile: language + hamburger. The menu panel lives inside the
            <details> and is positioned under the bar. */}
        <div className="flex items-center gap-3 lg:hidden">
          <LanguageSwitcher tone={transparent ? "light" : "dark"} />
        </div>
        <details ref={menuRef} className="group/menu flex items-center gap-3 lg:hidden">
          <summary
            className="flex list-none cursor-pointer items-center gap-3 [&::-webkit-details-marker]:hidden"
            aria-label={t.toggleMenu}
            role="button"
          >
            <span className="flex h-10 w-10 flex-col items-center justify-center gap-1.5">
              <span className={`block h-0.5 w-7 transition-all duration-300 ${hamburgerBar} group-open/menu:translate-y-2 group-open/menu:rotate-45`} />
              <span className={`block h-0.5 w-7 transition-all duration-300 ${hamburgerBar} group-open/menu:opacity-0`} />
              <span className={`block h-0.5 w-7 transition-all duration-300 ${hamburgerBar} group-open/menu:-translate-y-2 group-open/menu:-rotate-45`} />
            </span>
          </summary>

          {/* Mobile menu */}
          <div className={`absolute left-0 right-0 top-full lg:hidden ${mobileMenuClass}`}>
            <div className="flex flex-col gap-1 px-6 py-4">
              {links.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className={`rounded-xl px-4 py-3 text-base font-semibold transition ${mobileLinkClass}`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-2 px-4 pb-1">
                <LanguageSwitcher
                  variant="list"
                  tone={transparent ? "light" : "dark"}
                  onNavigate={closeMenu}
                />
              </div>
            </div>
          </div>
        </details>
      </div>

    </nav>
  );
}
