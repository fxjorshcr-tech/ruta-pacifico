import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { LOCALES, localePath, type Locale } from "@/lib/i18n";
import { pingIndexNow } from "@/lib/indexnow";
import { PEAK_CAPACITY, isPeakCapacityNoticeActive } from "@/lib/peakCapacity";
import { costaRicaNow } from "@/lib/leadTime";

/**
 * Daily Vercel cron (vercel.json) that retires the holiday-capacity notice
 * the morning after its window ends. The home, FAQ, booking page and
 * llms.txt regenerate daily on their own, but the ~1,400 route pages carry
 * the notice in their FAQ (HTML + JSON-LD) and only regenerate monthly, so
 * without this a route page rendered on December 30 would still say
 * "fully booked" at the end of January.
 *
 * It does nothing at all except on the first few mornings after
 * PEAK_CAPACITY.END_DATE, so hitting it on any other day is a no-op. When
 * CRON_SECRET is configured, only Vercel's cron (Authorization: Bearer) is
 * accepted; without it the date gate is the only guard, which is enough
 * because the purge is idempotent and limited to three days a year.
 */
export const dynamic = "force-dynamic";
export const maxDuration = 30;

/** How many mornings after the window the purge repeats, in case a run fails. */
const GRACE_DAYS = 3;

/** Site paths whose cached HTML mentions the window (both languages purged). */
const CONTENT_PATHS = ["/", "/private-shuttle", "/faq"];
const SHARED_FILES = ["/llms.txt", "/llms-full.txt"];

function addDays(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

/** True on the first mornings after the window: the only days a purge is needed. */
export function isPeakCapacityRefreshDay(today: string): boolean {
  return (
    !isPeakCapacityNoticeActive(new Date(`${today}T12:00:00Z`)) &&
    today <= addDays(PEAK_CAPACITY.END_DATE, GRACE_DAYS)
  );
}

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim();
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const today = costaRicaNow().date;
  if (!isPeakCapacityRefreshDay(today)) {
    return NextResponse.json({ ok: true, ran: false, today });
  }

  const refreshed: string[] = [];
  const changed: string[] = [];
  for (const p of CONTENT_PATHS) {
    for (const lang of LOCALES) {
      refreshed.push(`/${lang}${p === "/" ? "" : p}`);
      changed.push(localePath(lang as Locale, p));
    }
  }
  refreshed.push(...SHARED_FILES);
  changed.push(...SHARED_FILES);
  for (const p of refreshed) revalidatePath(p);

  // Every route page in both languages: the dynamic segment purge covers
  // prebuilt and on-demand-cached pages alike.
  revalidatePath("/[lang]/private-shuttle/[slug]", "page");
  refreshed.push("/[lang]/private-shuttle/[slug]");

  const indexNowSubmitted = await pingIndexNow(changed);
  return NextResponse.json({ ok: true, ran: true, today, refreshed, indexNowSubmitted });
}
