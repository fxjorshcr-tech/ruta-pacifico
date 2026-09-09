#!/usr/bin/env node
/**
 * Submit every public URL (or a given list) to IndexNow so Bing, Copilot,
 * DuckDuckGo, Yandex, Naver and Seznam re-crawl them within minutes instead
 * of waiting for the next scheduled crawl. Google does not use IndexNow.
 *
 * Usage:
 *   INDEXNOW_KEY=xxxx npm run indexnow                 # whole sitemap
 *   INDEXNOW_KEY=xxxx npm run indexnow -- /faq /blog   # specific paths/URLs
 *
 * The key must match what https://rutapacifico.com/indexnow-key.txt serves
 * (same INDEXNOW_KEY value in Vercel). A 200/202 response means accepted.
 */
const HOST = "rutapacifico.com";
const BASE = `https://${HOST}`;
const KEY_LOCATION = `${BASE}/indexnow-key.txt`;
const ENDPOINT = "https://api.indexnow.org/indexnow";
const BATCH = 10_000; // IndexNow maximum per request

const key = process.env.INDEXNOW_KEY?.trim();
if (!key) {
  console.error("INDEXNOW_KEY is not set. Add it to .env.local / Vercel and retry.");
  process.exit(1);
}

async function urlsFromSitemap() {
  const res = await fetch(`${BASE}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap.xml returned HTTP ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

function normalise(input) {
  if (/^https?:\/\//i.test(input)) return input;
  return `${BASE}${input.startsWith("/") ? "" : "/"}${input}`;
}

async function main() {
  const args = process.argv.slice(2);
  const urls = args.length ? args.map(normalise) : await urlsFromSitemap();
  const own = urls.filter((u) => new URL(u).hostname === HOST);
  if (!own.length) {
    console.error("Nothing to submit.");
    process.exit(1);
  }

  const served = await fetch(KEY_LOCATION).then((r) => (r.ok ? r.text() : ""));
  if (served.trim() !== key) {
    console.error(
      `${KEY_LOCATION} serves "${served.trim() || "(nothing)"}" but INDEXNOW_KEY is "${key}". ` +
        "Deploy the same INDEXNOW_KEY to Vercel first."
    );
    process.exit(1);
  }

  for (let i = 0; i < own.length; i += BATCH) {
    const urlList = own.slice(i, i + BATCH);
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host: HOST, key, keyLocation: KEY_LOCATION, urlList }),
    });
    const ok = res.status === 200 || res.status === 202;
    console.log(
      `${ok ? "OK " : "ERR"} IndexNow HTTP ${res.status} — ${urlList.length} URL(s)` +
        (ok ? "" : `: ${await res.text()}`)
    );
    if (!ok) process.exit(1);
  }
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
