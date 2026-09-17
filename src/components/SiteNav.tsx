"use client";

import { useState } from "react";
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
  const [open, setOpen] = useState(false);

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
    { href: "/prices", label: t.prices },
    { href: "/blog", label: t.blog },
    { href: "/faq", label: t.faq },
    { href: "/about-contact", label: t.about },
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
            priority
            unoptimized
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

        {/* Mobile: language + hamburger */}
        <div className="flex items-center gap-3 lg:hidden">
          <LanguageSwitcher tone={transparent ? "light" : "dark"} />
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5"
            aria-label={t.toggleMenu}
            aria-expanded={open}
          >
            <span className={`block h-0.5 w-7 transition-all duration-300 ${hamburgerBar} ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-7 transition-all duration-300 ${hamburgerBar} ${open ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-7 transition-all duration-300 ${hamburgerBar} ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          open ? "max-h-[32rem]" : "max-h-0"
        } ${mobileMenuClass}`}
      >
        <div className="flex flex-col gap-1 px-6 py-4">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`rounded-xl px-4 py-3 text-base font-semibold transition ${mobileLinkClass}`}
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-2 px-4 pb-1">
            <LanguageSwitcher
              variant="list"
              tone={transparent ? "light" : "dark"}
              onNavigate={() => setOpen(false)}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
