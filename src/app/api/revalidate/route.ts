import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { timingSafeEqual } from "crypto";
import { LOCALES, localePath, type Locale } from "@/lib/i18n";
import { pingIndexNow } from "@/lib/indexnow";

/**
 * On-demand cache refresh. The marketing pages are regenerated once a day
 * (route pages once a month) to keep Vercel's ISR usage low; after editing
 * prices, FAQs or a blog post, hit this endpoint and the next visit renders
 * from the current database state.
 *
 *   GET /api/revalidate?token=<REVALIDATE_TOKEN>&path=/prices
 *   GET /api/revalidate?token=<REVALIDATE_TOKEN>&path=/private-shuttle/<slug>
 *   GET /api/revalidate?token=<REVALIDATE_TOKEN>&scope=content
 *
 * `path` is a language-less site path (both languages are purged);
 * `scope=content` purges every page that lists prices or FAQs plus the
 * sitemap, llms.txt and routes.json. There is deliberately no "all routes"
 * scope: purging ~1,400 route pages in both languages re-renders every one
 * of them on its next visit, and each render is an ISR write.
 *
 * Every public URL that was purged is also submitted to IndexNow in the
 * same call (src/lib/indexnow.ts), so Bing — and through it ChatGPT search
 * and Copilot — re-crawls the changed price the same day. The response
 * reports how many URLs were submitted (`indexNowSubmitted`).
 *
 * Fail-closed: without REVALIDATE_TOKEN in the environment the endpoint
 * refuses to run.
 */
export const dynamic = "force-dynamic";

/** Pages whose content comes from the database. */
const CONTENT_PATHS = ["/", "/prices", "/private-shuttle", "/liberia-airport-shuttle", "/faq", "/blog"];
/** Language-less files that read the routes table. */
const SHARED_FILES = ["/sitemap.xml", "/llms.txt", "/llms-full.txt", "/routes.json"];

function tokensMatch(provided: string, expected: string): boolean {
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** The app paths behind a site path: /en/prices and /es/prices for /prices. */
function localized(path: string): string[] {
  const suffix = path === "/" ? "" : path;
  return LOCALES.map((lang) => `/${lang}${suffix}`);
}

/** The public URLs of a site path, for IndexNow: /prices and /es/prices. */
function publicUrls(path: string): string[] {
  return LOCALES.map((lang: Locale) => localePath(lang, path));
}

export async function GET(req: NextRequest) {
  const expected = process.env.REVALIDATE_TOKEN?.trim();
  if (!expected) {
    return NextResponse.json(
      { ok: false, error: "REVALIDATE_TOKEN is not configured" },
      { status: 503 }
    );
  }
  const token = req.nextUrl.searchParams.get("token") ?? "";
  if (!token || !tokensMatch(token, expected)) {
    return NextResponse.json({ ok: false, error: "invalid token" }, { status: 401 });
  }

  const scope = req.nextUrl.searchParams.get("scope");
  const path = req.nextUrl.searchParams.get("path");
  const refreshed: string[] = [];
  // Real public URLs (no /en prefix) handed to IndexNow.
  const changed: string[] = [];

  if (scope === "content") {
    for (const p of CONTENT_PATHS) {
      refreshed.push(...localized(p));
      changed.push(...publicUrls(p));
    }
    refreshed.push(...SHARED_FILES);
    changed.push("/llms.txt", "/llms-full.txt");
  } else if (path && path.startsWith("/")) {
    if (SHARED_FILES.includes(path)) {
      refreshed.push(path);
      if (path !== "/routes.json") changed.push(path);
    } else {
      const sitePath = path.replace(/^\/(en|es)(?=\/|$)/, "") || "/";
      refreshed.push(...localized(sitePath));
      changed.push(...publicUrls(sitePath));
    }
  } else {
    return NextResponse.json(
      { ok: false, error: "pass ?path=/site-path or ?scope=content" },
      { status: 400 }
    );
  }

  for (const p of refreshed) revalidatePath(p);
  const indexNowSubmitted = await pingIndexNow(changed);
  return NextResponse.json({ ok: true, refreshed, indexNowSubmitted });
}
