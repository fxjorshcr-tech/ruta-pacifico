import type { HubGuide, HubGuideLine } from "@/lib/hubGuide";
import { PRICE_LIST_PATH } from "@/lib/pricing";
import { WHATSAPP_DISPLAY, WHATSAPP_URL } from "@/lib/contact";
import { localeUrl, type Locale } from "@/lib/i18n";
import { HUB_GUIDE } from "@/i18n/hubGuide";

/**
 * A hub page as Markdown, for AI agents that negotiate
 * `Accept: text/markdown` or fetch the `.md` alias (see next.config.ts).
 * Same facts as the HTML page, from the same guide model, so the two can
 * never say different things: the facts, one table per direction with
 * every vehicle size, the rules, the hub's FAQ and the about block.
 */
export interface HubMarkdownInput {
  guide: HubGuide;
  locale: Locale;
  /** Language-less path of the HTML page: "/tamarindo-shuttle". */
  path: string;
  faqs: { q: string; a: string }[];
}

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

export function buildHubMarkdown({ guide, locale, path, faqs }: HubMarkdownInput): string {
  const t = HUB_GUIDE[locale];
  const m = t.markdown;
  const other: Locale = locale === "en" ? "es" : "en";
  const htmlUrl = localeUrl(locale, path);
  const otherUrl = localeUrl(other, path);
  const price = (p: number | null) => (p ? `$${p}` : t.onRequest);
  const row = (l: HubGuideLine) => [
    `${l.from} → ${l.to}`,
    l.time || "—",
    price(l.prices[0]),
    price(l.prices[1]),
    price(l.prices[2]),
    `[${m.bookLink}](${localeUrl(locale, l.href)})`,
  ];

  const out: string[] = [];
  out.push(`# ${m.title(guide.place)}`, "");
  out.push(`> ${guide.intro}`, "");

  out.push(`## ${m.summary}`, "");
  for (const f of guide.facts) out.push(`- ${f}`);
  out.push(`- **WhatsApp:** ${WHATSAPP_DISPLAY} — ${WHATSAPP_URL}`);
  out.push(`- **${m.htmlVersion}:** ${htmlUrl}`);
  out.push(`- **${m.otherLanguage}:** ${otherUrl}`, "");

  if (guide.departures.length) {
    out.push(`## ${guide.departuresHeading}`, "", table(m.columns, guide.departures.map(row)), "");
  }
  if (guide.arrivals.length) {
    out.push(`## ${guide.arrivalsHeading}`, "", table(m.columns, guide.arrivals.map(row)), "");
  }

  out.push(`## ${guide.policiesHeading}`, "", ...guide.policies.map((p, i) => `${i + 1}. ${p}`), "");

  if (faqs.length) {
    out.push(`## ${m.faq(guide.place)}`, "");
    for (const f of faqs) out.push(`### ${f.q}`, "", f.a, "");
  }

  out.push(`- ${m.allPrices}: ${localeUrl(locale, PRICE_LIST_PATH)}`, "");
  out.push(`## ${m.about}`, "", m.aboutText, "");
  out.push(`---`, "", `_${m.generated}_ ${htmlUrl}`, "");
  return out.join("\n");
}
