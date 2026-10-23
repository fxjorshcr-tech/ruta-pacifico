import type { Route } from "@/lib/routes";
import type { Destination } from "@/lib/destinations";
import type { RouteFaq } from "@/lib/routeFaqs";
import { localeUrl, type Locale } from "@/lib/i18n";
import { PRICE_LIST_PATH, lowestPrice, priceFacts, routePrices, routeUrl, travelTime } from "@/lib/pricing";
import { WHATSAPP_DISPLAY, WHATSAPP_URL, withCurrentContact } from "@/lib/contact";
import { routeSlug } from "@/lib/slug";
import { vehicleTierCopy } from "@/lib/vehicles";
import {
  buildCompareTable,
  buildRouteAnswer,
  pricesUpdatedLabel,
  routeNames,
  type RouteContext,
} from "@/lib/routeAnswer";
import { DESTINATION_GUIDE, ROUTE, ROUTE_FAQ } from "@/i18n/route";

/**
 * The route page as Markdown, for AI agents that negotiate
 * `Accept: text/markdown` or fetch the `.md` alias (see next.config.ts).
 * Same facts as the HTML page, same order, built from the same row,
 * destination guide and FAQ generator, so the two can never say different
 * things (Google has not ruled on Markdown negotiation; identical content
 * is what keeps it from ever reading as cloaking).
 */

export interface RouteMarkdownInput {
  route: Route;
  slug: string;
  locale: Locale;
  ctx: RouteContext;
  faqs: RouteFaq[];
  /** Guide copy, only when the page shows it (index-able route with a guide). */
  guide?: Destination;
  related: Route[];
  reverse?: Route;
}

/** Escape the characters that would break a Markdown table cell. */
function cell(text: string): string {
  return text.replace(/\|/g, "\\|").replace(/\s+/g, " ").trim();
}

function table(header: string[], rows: string[][]): string {
  return [
    `| ${header.map(cell).join(" | ")} |`,
    `| ${header.map(() => "---").join(" | ")} |`,
    ...rows.map((r) => `| ${r.map(cell).join(" | ")} |`),
  ].join("\n");
}

export function buildRouteMarkdown(input: RouteMarkdownInput): string {
  const { route, slug, locale, ctx, faqs, guide, related, reverse } = input;
  const t = ROUTE[locale];
  const m = t.markdown;
  const g = DESTINATION_GUIDE[locale];
  const { O, D } = routeNames(route, ctx);
  const other: Locale = locale === "en" ? "es" : "en";
  const htmlUrl = localeUrl(locale, `/private-shuttle/${slug}`);
  const otherUrl = localeUrl(other, `/private-shuttle/${slug}`);
  const bookUrl = `${htmlUrl}#booking`;
  const answer = buildRouteAnswer(route, ctx, locale);
  const updated = pricesUpdatedLabel(route, locale);
  const compare = buildCompareTable(route, ctx, locale);
  const prices = routePrices(route);

  const out: string[] = [];
  out.push(`# ${m.title(O, D)}`, "");
  if (answer) out.push(`> ${answer}`, "");

  // Facts block — the lines an agent needs to act, before any prose.
  const facts: string[] = [];
  const from = lowestPrice(route);
  if (from !== null) facts.push(`- **${m.prices.split(" (")[0]}:** ${m.from(from)} — ${prices.map((p) => `$${p.price} (${p.tier.minPax}–${p.tier.maxPax} pax)`).join(", ")}`);
  if (route.duracion) facts.push(`- **${m.travelTime}:** ${travelTime(route, locale)}`);
  facts.push(`- **${m.book}:** ${bookUrl}`);
  facts.push(`- **${m.whatsapp}:** ${WHATSAPP_DISPLAY} — ${WHATSAPP_URL}`);
  if (updated) facts.push(`- ${updated}`);
  facts.push(`- **${m.htmlVersion}:** ${htmlUrl}`);
  facts.push(`- **${m.otherLanguage}:** ${otherUrl}`);
  out.push(`## ${m.summary}`, "", ...facts, "");

  // Price table, one row per vehicle tier.
  if (prices.length) {
    out.push(`## ${m.prices}`, "");
    out.push(
      table(
        m.priceColumns,
        prices.map(({ tier, price }) => [
          vehicleTierCopy(tier.key, locale).paxLabel,
          `${tier.name} (${vehicleTierCopy(tier.key, locale).typicalUse})`,
          `$${price}`,
          `[${m.bookLink}](${bookUrl})`,
        ]),
      ),
      "",
    );
    out.push(...priceFacts(locale).map((f) => `- ${f}`), "");
  }

  if (compare) {
    out.push(`## ${compare.heading}`, "", compare.intro, "");
    out.push(table(compare.columns, compare.rows), "");
  }

  out.push(`## ${m.included}`, "", ...m.includedItems.map((i) => `- ${i}`), "");

  if (guide) {
    out.push(`## ${g.about(guide.short_name)}`, "", withCurrentContact(guide.intro_md.trim()), "");
    if (guide.arrival_md?.trim()) {
      out.push(`### ${g.rideFrom(O)}`, "", withCurrentContact(guide.arrival_md.trim()), "");
    }
    if (guide.tips_md?.trim()) {
      out.push(`### ${g.goodToKnow}`, "", withCurrentContact(guide.tips_md.trim()), "");
    }
  }

  if (faqs.length) {
    out.push(`## ${ROUTE_FAQ[locale].heading(O, D)}`, "");
    for (const f of faqs) out.push(`### ${f.q}`, "", f.a, "");
  }

  if (reverse || related.length) {
    out.push(`## ${m.related}`, "");
    if (reverse) {
      const price = lowestPrice(reverse);
      out.push(
        `- ${m.returnTrip}: ${reverse.origen} → ${reverse.destino}${price !== null ? ` (${m.from(price)})` : ""} — ${routeUrl(reverse, locale)}`,
      );
    }
    for (const r of related) {
      const price = lowestPrice(r);
      out.push(`- ${r.origen} → ${r.destino}${price !== null ? ` (${m.from(price)})` : ""} — ${routeUrl(r, locale)}`);
    }
    out.push(`- ${m.allPrices}: ${localeUrl(locale, PRICE_LIST_PATH)}`, "");
  }

  out.push(`## ${m.about}`, "", m.aboutText, "");
  out.push(`---`, "", `_${m.generated}_ ${localeUrl(locale, `/private-shuttle/${routeSlug(route.origen, route.destino)}`)}`, "");

  return out.join("\n");
}
