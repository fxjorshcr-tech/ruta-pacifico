import Link from "next/link";
import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";

export const metadata: Metadata = {
  title: "Page not found",
  description:
    "That page does not exist on Ruta Pacifico. Search every private shuttle route from Liberia Airport (LIR) and across Costa Rica.",
  robots: { index: false, follow: true },
  // Override the root layout's canonical ("/") — a 404 must not claim to be
  // the home page.
  alternates: {},
};

const POPULAR = [
  { href: "/private-shuttle", label: "Search all shuttle routes" },
  {
    href: "/private-shuttle/lir-liberia-int-airport-to-tamarindo-guanacaste",
    label: "Liberia Airport (LIR) → Tamarindo",
  },
  { href: "/faq", label: "Frequently asked questions" },
  { href: "/blog", label: "Guanacaste travel guide" },
  { href: "/about-contact", label: "Contact us" },
];

export default function NotFound() {
  return (
    <main className="bg-light-surface min-h-screen">
      <SiteNav transparent={false} />
      <section className="mx-auto max-w-3xl px-6 pt-32 pb-24 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-sunset-orange">
          Error 404
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Page not found
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-foreground/70">
          The link you followed no longer exists or has a typo. These are the
          pages people usually want.
        </p>
        <ul className="mx-auto mt-10 grid max-w-md gap-3 text-left">
          {POPULAR.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-medium text-foreground transition hover:border-sunset-orange hover:text-sunset-orange"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
