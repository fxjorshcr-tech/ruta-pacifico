/**
 * Machine-readable statement of what AI systems may do with the site's
 * content. One place, three outlets: the `Content-Signal` and
 * `Content-Usage` lines in /robots.txt (src/app/robots.txt/route.ts) and the
 * `Content-Usage` HTTP header on every response (next.config.ts).
 *
 * The policy: Ruta Pacifico wants to be indexed by search, quoted by answer
 * engines (RAG / grounding) and does not object to training. It matches the
 * explicit per-bot Allow rules in robots.txt; nothing here restricts
 * anything.
 *
 * No `@/` imports: next.config.ts loads this file too.
 */

/** contentsignals.org vocabulary (Cloudflare, Sept 2025): search, ai-input, ai-train. */
export const CONTENT_SIGNAL = "search=yes, ai-input=yes, ai-train=yes";

/**
 * IETF AI Preferences vocabulary (draft-ietf-aipref-vocab, Sept 2026):
 * train-ai, search, ai-use. Values are y / n.
 */
export const CONTENT_USAGE = "train-ai=y, search=y, ai-use=y";
