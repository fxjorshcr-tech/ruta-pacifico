import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { checkRateLimit, getClientIP } from "@/lib/rateLimit";
import { friendlyMessage } from "@/lib/powertranz";
import { confirmationPath } from "@/lib/rpBookings";

/** Recovery for the checkout when the iframe's postMessage never arrived. Non-sensitive data only. */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!checkRateLimit(`ptz_status:${getClientIP(request)}`, 30, 60).success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }
  const tx = request.nextUrl.searchParams.get("tx") || "";
  const locale = request.nextUrl.searchParams.get("lang") === "es" ? "es" : "en";
  if (!/^[0-9a-f-]{36}$/i.test(tx)) return NextResponse.json({ error: "Invalid tx" }, { status: 400 });

  const { data: row } = await getSupabaseAdmin()
    .from("powertranz_transactions")
    .select("status, iso_response_code, response_message, three_ds_authentication_status")
    .eq("transaction_identifier", tx)
    .maybeSingle();
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const pending = row.status === "initiated" || row.status === "authenticating";
  return NextResponse.json({
    status: row.status,
    ok: row.status === "approved",
    message: row.status === "approved"
      ? "Payment approved"
      : pending
        ? null
        : friendlyMessage(row.iso_response_code || undefined, row.response_message || undefined, row.three_ds_authentication_status || undefined, locale),
    redirectUrl: row.status === "approved" ? confirmationPath(true) : undefined,
  });
}
