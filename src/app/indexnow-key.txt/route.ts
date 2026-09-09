/**
 * IndexNow key file — https://www.indexnow.org/documentation
 *
 * Bing (and Copilot), DuckDuckGo, Yandex, Naver and Seznam verify that a
 * submitted URL really belongs to us by fetching this file and comparing it
 * with the `key` sent to https://api.indexnow.org/indexnow. The key lives in
 * the INDEXNOW_KEY environment variable so it can be rotated without a code
 * change; `npm run indexnow` sends `keyLocation` pointing here.
 */
export const dynamic = "force-static";

export function GET() {
  const key = process.env.INDEXNOW_KEY?.trim();
  if (!key) {
    return new Response("IndexNow key not configured", { status: 404 });
  }
  return new Response(key, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
