import type { NextRequest } from "next/server";
import { getRoutes } from "@/lib/routes";
import { getDestinations, routeSeoRank } from "@/lib/destinations";
import { buildHubGuide } from "@/lib/hubGuide";
import { buildHubMarkdown } from "@/lib/hubMarkdown";
import { LIR_HUB_PATH, lowestPrice } from "@/lib/pricing";
import { DEFAULT_LOCALE, isLocale, localePath } from "@/lib/i18n";
import { CONTENT_SIGNAL } from "@/lib/aiPolicy";
import { LIBERIA_AIRPORT } from "@/i18n/liberiaAirport";

/**
 * Markdown version of the Liberia Airport hub (/liberia-airport-shuttle),
 * reached through the rewrites in next.config.ts; canonical to the HTML.
 */
export const dynamic = "force-dynamic";

const LIR = /\bLIR\b/;

type Params = Promise<{ lang: string }>;

export async function GET(_req: NextRequest, { params }: { params: Params }) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const [routes, destinations] = await Promise.all([getRoutes(), getDestinations()]);
  const lirRoutes = routes
    .filter((r) => lowestPrice(r) && r.origen !== r.destino && (LIR.test(r.origen) || LIR.test(r.destino)))
    .sort((a, b) => routeSeoRank(a, destinations) - routeSeoRank(b, destinations) || a.origen.localeCompare(b.origen) || a.destino.localeCompare(b.destino));
  const t = LIBERIA_AIRPORT[locale];
  const guide = buildHubGuide({
    place: t.hero.titleAccent,
    from: lirRoutes.filter((r) => LIR.test(r.origen)),
    to: lirRoutes.filter((r) => LIR.test(r.destino)),
    map: destinations,
    locale,
  });

  const body = buildHubMarkdown({ guide, locale, path: LIR_HUB_PATH, faqs: t.faqs });
  const canonical = localePath(locale, LIR_HUB_PATH);
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
