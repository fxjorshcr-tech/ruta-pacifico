import type { NextRequest } from "next/server";
import { findRouteBySlug, getRoutes } from "@/lib/routes";
import {
  destinationFor,
  getDestinations,
  hasGuide,
  isRouteIndexable,
  localizeDestination,
  selectIndexableRoutes,
  type Destination,
} from "@/lib/destinations";
import { buildRouteFaqs } from "@/lib/routeFaqs";
import { buildRouteMarkdown } from "@/lib/routeMarkdown";
import { routeSlug } from "@/lib/slug";
import { DEFAULT_LOCALE, isLocale, localePath } from "@/lib/i18n";
import { CONTENT_SIGNAL } from "@/lib/aiPolicy";

/**
 * Markdown version of a route page. Reached only through the rewrites in
 * next.config.ts (`Accept: text/markdown` on the route URL, or the `.md`
 * alias); never linked as a page of its own, and canonical to the HTML.
 *
 * Rendered on demand and cached at the CDN for a day: agents asking for
 * Markdown are a fraction of a percent of bot traffic, so pre-rendering
 * ~2,800 of these at build time (and writing them to the ISR store) would
 * cost more than it saves. The routes table itself is memoised per
 * instance (src/lib/routes.ts), so a request is one table read at most.
 */
export const dynamic = "force-dynamic";

type Params = Promise<{ lang: string; slug: string }>;

export async function GET(_req: NextRequest, { params }: { params: Params }) {
  const { lang, slug } = await params;
  const locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const [route, destinations, allRoutes] = await Promise.all([
    findRouteBySlug(slug),
    getDestinations(),
    getRoutes(),
  ]);
  if (!route) {
    return new Response("Not found", {
      status: 404,
      headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" },
    });
  }

  // Same visibility rules as the HTML page: guide, FAQ and related routes
  // only on index-able routes, copy in the page language.
  const indexable = isRouteIndexable(route, destinations);
  const localize = (d: Destination | undefined) => (d ? localizeDestination(d, locale) : undefined);
  const origin = localize(destinationFor(route.origen, destinations));
  const destination = localize(destinationFor(route.destino, destinations));
  const showGuide = indexable && hasGuide(destination);
  const reverseSlug = routeSlug(route.destino, route.origen);
  const reverse = showGuide
    ? allRoutes.find(
        (r) => routeSlug(r.origen, r.destino) === reverseSlug && isRouteIndexable(r, destinations),
      )
    : undefined;
  const related = showGuide
    ? selectIndexableRoutes(
        allRoutes.filter(
          (r) =>
            r.id !== route.id &&
            r.id !== reverse?.id &&
            (r.origen === route.origen || r.destino === route.destino),
        ),
        destinations,
      ).slice(0, 8)
    : [];
  const faqs = indexable ? buildRouteFaqs(route, { origin, destination }, locale) : [];

  const body = buildRouteMarkdown({
    route,
    slug,
    locale,
    ctx: { origin, destination },
    faqs,
    guide: showGuide ? destination : undefined,
    related,
    reverse,
  });

  const canonical = localePath(locale, `/private-shuttle/${slug}`);
  return new Response(body, {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      // The same URL serves HTML or Markdown depending on Accept.
      vary: "Accept",
      "cache-control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
      // Rough token count (≈4 characters per token), the header Cloudflare's
      // Markdown for Agents sets so clients can budget context.
      "x-markdown-tokens": String(Math.ceil(body.length / 4)),
      "content-signal": CONTENT_SIGNAL,
      // The HTML page is the canonical representation.
      link: `<https://rutapacifico.com${canonical}>; rel="canonical"; type="text/html"`,
    },
  });
}
