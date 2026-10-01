import { notFound } from "next/navigation";

/**
 * Anything under /[lang] that no page claims (e.g. /es/does-not-exist, or
 * /does-not-exist after the rewrite prefixes it) is a 404.
 *
 * No path is ever generated and `dynamicParams` is off, so the 404 is
 * answered at the routing layer with the pre-rendered not-found page. With
 * the default (`dynamicParams = true`) every bot probe — /wp-login.php,
 * /.env, dead URLs from old sitemaps — spun up a function and wrote a 404
 * into the ISR cache, which Vercel bills per 8 KB.
 */
export const dynamicParams = false;

export function generateStaticParams(): { rest: string[] }[] {
  return [];
}

export default function CatchAll() {
  notFound();
}
