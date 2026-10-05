import type { MetadataRoute } from "next";

const BASE = "https://rutapacifico.com";

/**
 * Answer engines and assistants that send travellers to the site. They are
 * named explicitly because several of them (GPTBot, Google-Extended,
 * Applebot-Extended, ClaudeBot…) only treat a site as opted in to AI
 * answers when the rule addresses them directly. Google-Extended and
 * Applebot-Extended are permission tokens, not crawlers: Googlebot and
 * Applebot do the fetching either way, so listing them costs nothing.
 */
const AI_ANSWER_ENGINES = [
  // OpenAI: ChatGPT search, user-initiated fetches, model training
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
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

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default — everyone else can crawl everything public.
      {
        userAgent: "*",
        allow: "/",
        disallow: PRIVATE_PATHS,
      },
      {
        userAgent: AI_ANSWER_ENGINES,
        allow: "/",
        disallow: PRIVATE_PATHS,
      },
      {
        userAgent: BLOCKED_CRAWLERS,
        disallow: "/",
      },
    ],
    sitemap: [`${BASE}/sitemap.xml`],
    host: BASE,
  };
}
