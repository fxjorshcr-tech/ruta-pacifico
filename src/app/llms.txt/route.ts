import { getRoutes } from "@/lib/routes";
import { getDestinations } from "@/lib/destinations";
import { getGoogleRating } from "@/lib/googleRating";
import { buildLlmsTxt } from "@/lib/llms";

/**
 * /llms.txt — short, human-authored summary for answer engines, with a live
 * price table for the most requested airport routes. Generated from the
 * database (cached hourly) so it can never drift from the booking system
 * the way the old static file in /public did.
 */
export const revalidate = 3600;

export async function GET() {
  const [routes, destinations, rating] = await Promise.all([
    getRoutes(),
    getDestinations(),
    getGoogleRating(),
  ]);
  return new Response(buildLlmsTxt(routes, destinations, rating), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
