import type { NextRequest } from "next/server";
import { getRoutes } from "@/lib/routes";
import { getDestinations, localizeDestination } from "@/lib/destinations";
import { findDestinationHub, hubFacts } from "@/lib/destinationHubs";
import { buildHubGuide } from "@/lib/hubGuide";
import { buildHubMarkdown } from "@/lib/hubMarkdown";
import { lowestPrice } from "@/lib/pricing";
import { toSlug } from "@/lib/slug";
import { DEFAULT_LOCALE, isLocale, localePath } from "@/lib/i18n";
import { CONTENT_SIGNAL } from "@/lib/aiPolicy";
import { DESTINATION_HUB } from "@/i18n/destinationHub";

/**
 * Markdown version of a destination hub (/tamarindo-shuttle). Reached only
 * through the rewrites in next.config.ts (`Accept: text/markdown` on the
 * hub URL, or the `.md` alias); canonical to the HTML page. Rendered on
 * demand and cached at the CDN for a day, like the route Markdown.
 */
export const dynamic = "force-dynamic";

type Params = Promise<{ lang: string; destination: string }>;

export async function GET(_req: NextRequest, { params }: { params: Params }) {
  const { lang, destination } = await params;
  const locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const [hub, destinations, routes] = await Promise.all([findDestinationHub(destination), getDestinations(), getRoutes()]);
  if (!hub) {
    return new Response("Not found", {
      status: 404,
      headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" },
    });
  }

  // Same route set as the HTML page: every priced route touching the place.
  const placeSlug = hub.destination.slug;
  const priced = routes.filter((r) => lowestPrice(r) && r.origen !== r.destino);
  const from = priced.filter((r) => toSlug(r.origen) === placeSlug);
  const to = priced.filter((r) => toSlug(r.destino) === placeSlug);
  const name = localizeDestination(hub.destination, locale).short_name;
  const guide = buildHubGuide({ place: name, from, to, map: destinations, locale });
  const facts = { ...hubFacts(hub, locale), fromCount: from.length, toCount: to.length };
  const faqs = DESTINATION_HUB[locale].faqs(facts);

  const body = buildHubMarkdown({ guide, locale, path: hub.path, faqs });
  const canonical = localePath(locale, hub.path);
  return new Response(body, {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      vary: "Accept",
      "cache-control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
      "x-markdown-tokens": String(Math.ceil(body.length / 4)),
      "content-signal": CONTENT_SIGNAL,
      link: `<https://rutapacifico.com${canonical}>; rel="canonical"; type="text/html"`,
    },
  });
}
