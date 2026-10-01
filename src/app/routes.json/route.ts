import { getRoutes } from "@/lib/routes";
import type { RouteMap } from "@/components/RouteSearch";

/**
 * /routes.json — the origin → destinations map the route search loads in
 * the browser. Pre-rendered at build time and served from the CDN, so the
 * ~1,400 pairs no longer travel inside the HTML of every page view.
 * Regenerated daily; /api/revalidate?path=/routes.json publishes a change
 * sooner.
 */
export const dynamic = "force-static";
export const revalidate = 86400;

export async function GET() {
  const routes = await getRoutes();
  const map: RouteMap = {};
  for (const r of routes) {
    const list = (map[r.origen] ??= []);
    if (!list.includes(r.destino)) list.push(r.destino);
  }
  return Response.json(map, {
    headers: {
      "cache-control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
