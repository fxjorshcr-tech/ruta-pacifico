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
 */
export default function LocaleLink({ href, ...rest }: Props) {
  const locale = useLocale();
  const internal = href.startsWith("/") && !href.startsWith("//");
  const target =
    internal && splitLocale(href).locale === DEFAULT_LOCALE ? localePath(locale, href) : href;
  return <Link href={target} {...rest} />;
}
