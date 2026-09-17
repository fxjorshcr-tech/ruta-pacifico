import { getRoutes } from "@/lib/routes";
import { getDestinations } from "@/lib/destinations";
import { getGoogleRating } from "@/lib/googleRating";
import { buildLlmsFullTxt } from "@/lib/llms";

/**
 * /llms-full.txt — the complete context for language models, including
 * every priced route (1,000+ rows) grouped by airport. Text is cheap, so
 * this is the one place that lists all of them; the HTML /prices page keeps
 * to the index-able subset.
 */
export const revalidate = 3600;

export async function GET() {
  const [routes, destinations, rating] = await Promise.all([
    getRoutes(),
    getDestinations(),
    getGoogleRating(),
  ]);
  return new Response(buildLlmsFullTxt(routes, destinations, rating), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
