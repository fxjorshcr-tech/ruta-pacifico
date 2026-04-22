import type { MetadataRoute } from "next";

const BASE = "https://rutapacificocr.com";

/**
 * AI and LLM crawlers we explicitly welcome. Keeping them listed by name (in
 * addition to the wildcard `*` allow) means our content is unambiguously
 * available to ChatGPT, Claude, Perplexity, Gemini/Google-AI, Copilot, Apple
 * Intelligence, DuckDuckGo AI and the other answer engines travellers
 * increasingly use when researching Costa Rica shuttles.
 */
const AI_CRAWLERS = [
  // OpenAI
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  // Anthropic
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "ClaudeBot-User",
  // Google AI surfaces (Gemini, AI Overviews)
  "Google-Extended",
  "GoogleOther",
  // Perplexity
  "PerplexityBot",
  "Perplexity-User",
  // Common Crawl (training corpus for many LLMs)
  "CCBot",
  // Amazon / Alexa
  "Amazonbot",
  // Apple Intelligence / Spotlight
  "Applebot",
  "Applebot-Extended",
  // Meta AI
  "Meta-ExternalAgent",
  "FacebookBot",
  // Microsoft Copilot (also uses Bingbot)
  "Bingbot",
  // Bytedance / TikTok
  "Bytespider",
  // You.com
  "YouBot",
  // Cohere
  "cohere-ai",
  // Diffbot
  "Diffbot",
  // Mistral
  "MistralAI-User",
  // DuckDuckGo AI
  "DuckAssistBot",
  // Timpi
  "Timpibot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default — everyone can crawl everything public.
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/private-shuttle/checkout",
          "/private-shuttle/confirmation",
          "/api/",
        ],
      },
      // Explicitly welcome AI crawlers so they don't fall back to ambiguous
      // defaults. Some of them (GPTBot, Google-Extended, Applebot-Extended,
      // ClaudeBot…) only treat a site as "opted-in to AI training / answer
      // retrieval" when they are named directly.
      {
        userAgent: AI_CRAWLERS,
        allow: "/",
        disallow: [
          "/private-shuttle/checkout",
          "/private-shuttle/confirmation",
          "/api/",
        ],
      },
    ],
    // Multiple sitemap/llms endpoints so every crawler finds the full corpus.
    sitemap: [`${BASE}/sitemap.xml`],
    host: BASE,
  };
}
