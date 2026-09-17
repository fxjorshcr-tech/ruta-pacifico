import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n";

/**
 * Every page lives under app/[lang]. English URLs carry no prefix, so a
 * request for /prices is rewritten (invisibly) to /en/prices, /es/prices
 * passes through, and an explicit /en/prices is redirected to its canonical
 * /prices so the same page never exists at two English addresses.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const [, first] = pathname.split("/");

  if (first === DEFAULT_LOCALE) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(`/${DEFAULT_LOCALE}`.length) || "/";
    return NextResponse.redirect(url, 308);
  }
  if (isLocale(first)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Skip API routes, Next internals and anything with a file extension
  // (sitemap.xml, robots.txt, llms.txt, manifest.webmanifest, images).
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
