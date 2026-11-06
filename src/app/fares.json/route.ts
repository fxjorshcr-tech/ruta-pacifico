import { getRoutes } from "@/lib/routes";
import { durationMinutes } from "@/lib/routeFaqs";
import { lowestPrice } from "@/lib/pricing";

/**
 * /fares.json — every priced route as a compact tuple, for the place finder
 * on /destinations: `[origen, destino, price1to5, price6to9, price10to12,
 * minutes]`, unpriced sizes and unknown drive times as 0. Like
 * /routes.json it is pre-rendered, served from the CDN and fetched by the
 * browser only when a visitor picks a place, so ~1,400 routes with prices
 * never travel inside the page HTML. Regenerated daily;
 * /api/revalidate?path=/fares.json publishes a change sooner.
 */
export const dynamic = "force-static";
export const revalidate = 86400;

export type FareTuple = [string, string, number, number, number, number];

export async function GET() {
  const routes = await getRoutes();
  const fares: FareTuple[] = [];
  for (const r of routes) {
    if (r.origen === r.destino || !lowestPrice(r)) continue;
    fares.push([
      r.origen,
      r.destino,
      r.precio1a5,
      r.precio6a9 ?? 0,
      r.precio10a12 ?? 0,
      durationMinutes(r.duracion) ?? 0,
    ]);
  }
  return Response.json(fares, {
    headers: {
      "cache-control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
