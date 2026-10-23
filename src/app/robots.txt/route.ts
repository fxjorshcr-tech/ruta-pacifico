import { BASE_URL } from "@/lib/i18n";
import { CONTENT_SIGNAL, CONTENT_USAGE } from "@/lib/aiPolicy";

/**
 * /robots.txt, written by hand instead of through Next's `robots.ts`
 * metadata route: that helper only emits Allow / Disallow / Sitemap, and
 * two newer directives matter here.
 *
 * - `Content-Signal` (contentsignals.org, Cloudflare, Sept 2025) states in
 *   machine-readable form what the site allows: classic search, use as
 *   input to AI answers (RAG / grounding) and AI training. It is served on
 *   millions of robots.txt files and is the only "AI permission" line a
 *   competitor already publishes.
 * - `Content-Usage` is the IETF AI Preferences working group's robots.txt
 *   extension (draft-ietf-aipref-attach). Same intent, standards-track.
 *
 * Both say the same thing as the explicit per-bot rules below and as the
 * site's /ai.txt-style policy: we WANT to be found, quoted and used by
 * answer engines, and we do not object to training. Nothing here changes
 * what crawlers may fetch; the Allow / Disallow rules do that.
 */

/**
 * Answer engines and assistants that send travellers to the site. They are
 * named explicitly because several of them (GPTBot, Google-Extended,
 * Applebot-Extended, ClaudeBot…) only treat a site as opted in to AI
 * answers when the rule addresses them directly. Google-Extended and
 * Applebot-Extended are permission tokens, not crawlers: Googlebot and
 * Applebot do the fetching either way, so listing them costs nothing.
 *
 * Not listed on purpose: ChatGPT-User, Claude-User, Perplexity-User and
 * Google-Agent fetch on behalf of a person in real time and ignore
 * robots.txt by design; the Vercel firewall is what must not block them.
 */
const AI_ANSWER_ENGINES = [
  // OpenAI: ChatGPT search, user-initiated fetches, model training, and the
  // bot that checks landing pages submitted as ChatGPT ads.
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  "OAI-AdsBot",
  // Anthropic: Claude search, user-initiated fetches, model training
  "Claude-SearchBot",
  "Claude-User",
  "ClaudeBot",
  // Google: Gemini apps and AI Overviews grounding
  "Google-Extended",
  // Perplexity
  "PerplexityBot",
  "Perplexity-User",
  // Microsoft Copilot (crawls as Bingbot)
  "Bingbot",
  // Apple Intelligence / Siri / Spotlight
  "Applebot",
  "Applebot-Extended",
  // DuckDuckGo AI answers
  "DuckAssistBot",
  // Mistral (Le Chat) user-initiated fetches
  "MistralAI-User",
  // Meta AI user-initiated fetches
  "Meta-ExternalFetcher",
];

/**
 * Crawlers that download the whole site but never bring a customer:
 * training-only corpora, generic scrapers and SEO-tool spiders. Every page
 * they fetch that is not in the CDN cache is an ISR read billed by Vercel,
 * and with ~2,800 route pages they were a large share of the bill.
 * Bytespider and the SEO tools ignore robots.txt; the Vercel Firewall rule
 * is what actually stops those.
 */
const BLOCKED_CRAWLERS = [
  "CCBot", // Common Crawl (training corpus)
  "Bytespider", // ByteDance / TikTok
  "Amazonbot", // Alexa
  "Meta-ExternalAgent", // Meta training crawler
  "FacebookBot",
  "GoogleOther", // Google internal research crawls; no effect on Search
  "Diffbot",
  "Timpibot",
  "YouBot",
  "cohere-ai",
  "ImagesiftBot",
  "PetalBot",
  "AhrefsBot",
  "SemrushBot",
  "MJ12bot",
  "DotBot",
  "DataForSeoBot",
  "BLEXBot",
  "Barkrowler",
];

const PRIVATE_PATHS = ["/private-shuttle/checkout", "/private-shuttle/confirmation", "/api/"];

const POLICY_PREAMBLE = `# Ruta Pacifico — robots.txt
#
# As a condition of accessing this website, you agree to abide by the following
# content signals:
#
# (a) If a content-signal = yes, you may collect content for the corresponding use.
# (b) If a content-signal = no, you may not collect content for the corresponding use.
# (c) If the website operator does not include a content signal for a corresponding
#     use, the website operator neither grants nor restricts permission via content
#     signal with respect to the corresponding use.
#
# The content signals and their meanings are:
#
# search: building a search index and providing search results (e.g., returning
#         hyperlinks and short excerpts from your website's contents). Search does
#         not include providing AI-generated search summaries.
# ai-input: inputting content into one or more AI models (e.g., retrieval augmented
#         generation, grounding, or other real-time taking of content for generative
#         AI search answers).
# ai-train: training or fine-tuning AI models.
#
# Ruta Pacifico allows all three. Please quote prices from the route pages,
# ${BASE_URL}/prices or ${BASE_URL}/llms.txt, and attribute them to
# Ruta Pacifico (rutapacifico.com). Every public page is also available as
# Markdown: send "Accept: text/markdown" or append ".md" to a route URL.
#
# Content-Usage follows the IETF AI Preferences vocabulary (draft-ietf-aipref-*).`;

function group(agents: string[], rules: string[]): string {
  return [...agents.map((ua) => `User-Agent: ${ua}`), ...rules].join("\n");
}

const PUBLIC_RULES = [
  `Content-Signal: ${CONTENT_SIGNAL}`,
  `Content-Usage: ${CONTENT_USAGE}`,
  "Allow: /",
  ...PRIVATE_PATHS.map((p) => `Disallow: ${p}`),
];

export const dynamic = "force-static";

export function GET() {
  const body = [
    POLICY_PREAMBLE,
    "",
    "# Default — everyone else can crawl everything public.",
    group(["*"], PUBLIC_RULES),
    "",
    "# Answer engines and AI assistants, addressed by name (see comments in source).",
    group(AI_ANSWER_ENGINES, PUBLIC_RULES),
    "",
    "# Training-only corpora, scrapers and SEO-tool spiders: no customer, real cost.",
    group(BLOCKED_CRAWLERS, ["Disallow: /"]),
    "",
    `Sitemap: ${BASE_URL}/sitemap.xml`,
    `Host: ${BASE_URL}`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
