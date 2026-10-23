import { BASE_URL } from "@/lib/i18n";

/**
 * IndexNow pings — tell Bing (and every IndexNow engine: Copilot,
 * DuckDuckGo, Yandex, Naver, Seznam) which URLs just changed so they are
 * re-crawled in hours instead of weeks. ChatGPT search answers from Bing's
 * index, so a price change reaches ChatGPT through this ping too. Google
 * does not use IndexNow; it reads `lastmod` in the sitemap instead.
 *
 * The key lives in the INDEXNOW_KEY environment variable and is served at
 * /indexnow-key.txt (src/app/indexnow-key.txt/route.ts); `npm run indexnow`
 * uses the same key for bulk submissions. Pings only happen from the
 * manually triggered /api/revalidate endpoint: no crons, no per-visit work.
 */
const HOST = new URL(BASE_URL).host;
const ENDPOINT = "https://api.indexnow.org/indexnow";

/**
 * Submit site paths (e.g. "/prices", "/es/prices"). Never throws: a failed
 * ping must not fail the revalidation that triggered it. Returns the number
 * of URLs submitted, 0 when the key is missing or the request failed.
 */
export async function pingIndexNow(paths: string[]): Promise<number> {
  const key = process.env.INDEXNOW_KEY?.trim();
  if (!key) return 0;

  const urlList = [...new Set(paths)]
    .filter((p) => p.startsWith("/"))
    .map((p) => `${BASE_URL}${p}`)
    .slice(0, 10_000); // protocol cap per submission
  if (urlList.length === 0) return 0;

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: HOST,
        key,
        keyLocation: `${BASE_URL}/indexnow-key.txt`,
        urlList,
      }),
      // A slow endpoint must not hold the revalidate response hostage.
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok && res.status !== 202) {
      console.error("[INDEXNOW] ping rejected:", res.status, await res.text());
      return 0;
    }
    return urlList.length;
  } catch (err) {
    console.error("[INDEXNOW] ping failed:", err);
    return 0;
  }
}
