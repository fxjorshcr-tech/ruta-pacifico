import { type NextRequest } from "next/server";
import { getSupabase } from "@/lib/supabase";

/**
 * Records location searches that returned no result in the route finder, so
 * we can see exactly which hotels to add to `src/lib/hotels.ts`.
 *
 * Writes go to the `hotel_search_misses` table (shared with Cant Wait Travel,
 * same Supabase project) through the `log_hotel_miss()` RPC, which upserts and
 * increments a hit counter atomically. See supabase/hotel_search_misses.sql.
 * Best-effort telemetry: never user-facing, failures are logged and swallowed.
 */

export const runtime = "nodejs";

const MIN_LENGTH = 3;
const MAX_LENGTH = 80;

// Tiny in-memory limiter: enough to stop a script from filling the table
// from one address. Resets per server instance, which is fine for telemetry.
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 30;
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || entry.resetAt <= now) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    if (hits.size > 5000) {
      for (const [key, value] of hits) if (value.resetAt <= now) hits.delete(key);
    }
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  if (rateLimited(ip)) {
    return Response.json({ ok: false }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: true });
  }

  const raw =
    body && typeof body === "object" && "query" in body
      ? (body as { query: unknown }).query
      : null;
  const query = typeof raw === "string" ? raw.trim() : "";
  if (query.length < MIN_LENGTH || query.length > MAX_LENGTH) {
    return Response.json({ ok: true });
  }

  try {
    const { error } = await getSupabase().rpc("log_hotel_miss", { q: query });
    if (error) console.error("[hotel-miss] RPC failed:", error.message);
  } catch (err) {
    console.error("[hotel-miss] error:", err);
  }

  return Response.json({ ok: true });
}
