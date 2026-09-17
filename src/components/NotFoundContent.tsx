"use client";

import Link from "@/components/LocaleLink";
import { useLocale } from "@/components/LocaleProvider";
import { NOT_FOUND } from "@/i18n/site";

/** Body of the 404 page; a client component because not-found.tsx receives no route params. */
export default function NotFoundContent() {
  const t = NOT_FOUND[useLocale()];
  return (
    <section className="mx-auto max-w-3xl px-6 pt-32 pb-24 text-center">
      <p className="text-xs font-semibold uppercase tracking-wider text-sunset-orange">{t.eyebrow}</p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{t.title}</h1>
      <p className="mx-auto mt-4 max-w-xl text-base text-foreground/70">{t.body}</p>
      <ul className="mx-auto mt-10 grid max-w-md gap-3 text-left">
        {t.links.map((item) => (
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
  );
}
