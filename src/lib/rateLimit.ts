import type { NextRequest } from "next/server";

/**
 * Tiny in-memory rate limiter for the payment endpoints. Per serverless
 * instance, so it is a speed bump against carding scripts and double
 * clicks, not a hard guarantee — the gateway and the atomic booking claim
 * are the real protections.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number,
): { success: boolean; remaining: number } {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    if (buckets.size > 5000) {
      for (const [k, v] of buckets) if (v.resetAt <= now) buckets.delete(k);
    }
    return { success: true, remaining: limit - 1 };
  }
  b.count += 1;
  return { success: b.count <= limit, remaining: Math.max(0, limit - b.count) };
}

export function getClientIP(request: NextRequest): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}
