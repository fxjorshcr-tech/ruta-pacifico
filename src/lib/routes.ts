import { getSupabase } from "@/lib/supabase";
import { routeSlug } from "@/lib/slug";

/**
 * A route, with prices already mapped onto the passenger tiers the site sells.
 *
 * IMPORTANT — the `routes` table is shared with Cant Wait Travel, so its
 * columns are never renamed. The three price columns are still called
 * `precio1a6`, `precio7a9` and `precio10a12`; only the passenger range each
 * one covers changed. `normalizeRoute()` below is the single place that
 * translates column name → tier, so nothing else in the app has to know that
 * the column names no longer match the ranges they price.
 */
export interface Route {
  id: number;
  origen: string;
  destino: string;
  /** 1 – 5 passengers (Hyundai Staria). Column: `precio1a6`. */
  precio1a5: number;
  /** 6 – 9 passengers (Toyota Hiace), if offered. Column: `precio7a9`. */
  precio6a9: number | null;
  /** 10 – 12 passengers (Maxus V90), if offered. Column: `precio10a12`. */
  precio10a12: number | null;
  duracion: string;
  alias: string | null;
}

/** A row exactly as the shared `routes` table stores it. */
interface RouteRow {
  id: number;
  origen: string;
  destino: string;
  precio1a6: number | null;
  precio7a9: number | null;
  precio10a12: number | null;
  duracion: string | null;
  alias: string | null;
}

const ROUTE_COLUMNS =
  "id, origen, destino, precio1a6, precio7a9, precio10a12, duracion, alias";

function toPrice(value: number | null): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function normalizeRoute(row: RouteRow): Route {
  return {
    id: row.id,
    origen: row.origen,
    destino: row.destino,
    precio1a5: toPrice(row.precio1a6) ?? 0,
    precio6a9: toPrice(row.precio7a9),
    precio10a12: toPrice(row.precio10a12),
    duracion: row.duracion ?? "",
    alias: row.alias,
  };
}

/** Every route, paginated past Supabase's 1000-row response cap. */
export async function getRoutes(): Promise<Route[]> {
  const allRoutes: Route[] = [];
  const pageSize = 1000;
  let from = 0;
  let hasMore = true;

  while (hasMore) {
    const { data, error } = await getSupabase()
      .from("routes")
      .select(ROUTE_COLUMNS)
      .order("origen", { ascending: true })
      .range(from, from + pageSize - 1);

    if (error) {
      console.error("Failed to fetch routes:", error.message);
      break;
    }

    if (data) {
      allRoutes.push(...(data as RouteRow[]).map(normalizeRoute));
    }

    hasMore = (data?.length ?? 0) === pageSize;
    from += pageSize;
  }

  return allRoutes;
}

export async function findRouteBySlug(slug: string): Promise<Route | null> {
  const all = await getRoutes();
  return all.find((r) => routeSlug(r.origen, r.destino) === slug) ?? null;
}
