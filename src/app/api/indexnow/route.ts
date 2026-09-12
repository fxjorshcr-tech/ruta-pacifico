import { NextRequest } from "next/server";

/**
 * Daily IndexNow submission, run by the Vercel cron in vercel.json.
 *
 * Submits every URL in our sitemap to https://api.indexnow.org so Bing (which
 * feeds ChatGPT search and Copilot), DuckDuckGo, Yandex, Naver and Seznam
 * re-crawl the price list, llms.txt and the route pages within minutes of a
 * price change instead of on their own schedule. Google ignores IndexNow;
 * it follows the sitemap. Same logic as `npm run indexnow`, without needing
 * a laptop with Node on it.
 *
 * Only the cron may call this: Vercel sends `Authorization: Bearer
 * $CRON_SECRET` when that env var is set, and identifies itself as
 * `vercel-cron/1.0` otherwise. Anyone else gets a 401 so nobody can spam
 * IndexNow with our key and get it throttled.
 */
export const dynamic = "force-dynamic";

const HOST = "rutapacifico.com";
const BASE = `https://${HOST}`;
const KEY_LOCATION = `${BASE}/indexnow-key.txt`;
const ENDPOINT = "https://api.indexnow.org/indexnow";
/** Always submitted first: the pages answer engines should re-read daily. */
const PRIORITY_PATHS = ["/", "/prices", "/private-shuttle", "/llms.txt", "/llms-full.txt", "/sitemap.xml"];

function authorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (secret) return req.headers.get("authorization") === `Bearer ${secret}`;
  return (req.headers.get("user-agent") ?? "").startsWith("vercel-cron/");
}

async function sitemapUrls(): Promise<string[]> {
  const res = await fetch(`${BASE}/sitemap.xml`, { cache: "no-store" });
  if (!res.ok) throw new Error(`sitemap.xml returned HTTP ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  const key = process.env.INDEXNOW_KEY?.trim();
  if (!key) {
    return Response.json({ error: "INDEXNOW_KEY is not configured" }, { status: 500 });
  }

  try {
    const fromSitemap = await sitemapUrls();
    const urlList = [
      ...new Set([...PRIORITY_PATHS.map((p) => `${BASE}${p}`), ...fromSitemap]),
    ].filter((u) => new URL(u).hostname === HOST);

    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host: HOST, key, keyLocation: KEY_LOCATION, urlList }),
    });
    const ok = res.status === 200 || res.status === 202;
    const body = { ok, status: res.status, submitted: urlList.length, at: new Date().toISOString() };
    if (!ok) console.error("IndexNow rejected the submission:", res.status, await res.text());
    else console.log(`IndexNow accepted ${urlList.length} URL(s) (HTTP ${res.status})`);
    return Response.json(body, { status: ok ? 200 : 502 });
  } catch (err) {
    console.error("IndexNow submission failed:", err);
    return Response.json({ ok: false, error: String(err) }, { status: 502 });
  }
}
