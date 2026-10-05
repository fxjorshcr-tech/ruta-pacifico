"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { DEFAULT_LOCALE, localePath, splitLocale } from "@/lib/i18n";
import { useLocale } from "@/components/LocaleProvider";

type Props = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

/**
 * Drop-in for next/link: an internal path ("/prices") is prefixed with the
 * current locale ("/es/prices" on the Spanish site). External URLs,
 * anchors and already-prefixed paths pass through untouched.
 *
 * Prefetch is off by default. next/link otherwise downloads the RSC payload
 * of every link that scrolls into view (60-300 KB each; /prices lists ~180
 * route pages), and on Vercel each of those downloads is a CDN request plus,
 * on a cache miss, an ISR read billed per 8 KB. A click now fetches the page
 * from the CDN on demand, which is still well under a second. Pass
 * `prefetch` explicitly to opt a link back in.
 */
export default function LocaleLink({ href, ...rest }: Props) {
  const locale = useLocale();
  const internal = href.startsWith("/") && !href.startsWith("//");
  const target =
    internal && splitLocale(href).locale === DEFAULT_LOCALE ? localePath(locale, href) : href;
  return <Link href={target} prefetch={false} {...rest} />;
}
