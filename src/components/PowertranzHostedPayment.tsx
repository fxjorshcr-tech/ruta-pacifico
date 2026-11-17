"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale } from "@/components/LocaleProvider";
import PaymentBadges from "@/components/PaymentBadges";
import { PAYMENT } from "@/i18n/payment";

/**
 * Card step of the checkout, powered by BAC Credomatic / Powertranz
 * (SPI + 3-D Secure 2.x + Hosted Payment Page).
 *
 *   1. POST /api/powertranz/start { bookingId } → RedirectData (HTML)
 *   2. Render it in an <iframe srcdoc>. Powertranz shows its hosted card
 *      form there and runs 3-D Secure (frictionless or challenge).
 *   3. Powertranz posts the result to /api/powertranz/callback inside that
 *      iframe; the callback finalises the charge and postMessages the
 *      outcome back to this page.
 *   4. ok → onSuccess(). Declined → message, retry (a brand-new session) and,
 *      only then, the "email me a payment link" fallback.
 *
 * Card data never touches our DOM or our servers.
 */
interface Props {
  bookingId: string;
  amount: number;
  onSuccess: (result: { redirectUrl?: string }) => void;
  onPayLater?: () => void;
}

type Stage =
  | { kind: "loading" }
  | { kind: "iframe"; tx: string; html: string }
  | { kind: "checking"; tx: string }
  | { kind: "approved" }
  | { kind: "failed"; message: string; canRetry: boolean }
  | { kind: "unavailable" };

interface ResultMessage {
  type: "powertranz:result";
  tx: string;
  ok: boolean;
  status: "approved" | "declined" | "error" | "duplicate";
  message: string;
  redirectUrl?: string;
}

const Spinner = () => (
  <div className="h-8 w-8 animate-spin rounded-full border-4 border-sunset-orange/20 border-t-sunset-orange" />
);

export default function PowertranzHostedPayment({ bookingId, amount, onSuccess, onPayLater }: Props) {
  const locale = useLocale();
  const t = PAYMENT[locale];

  const [stage, setStage] = useState<Stage>({ kind: "loading" });
  const [payLaterState, setPayLaterState] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const currentTx = useRef<string | null>(null);
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;
  const unavailableCopy = useRef(t.unavailable);
  unavailableCopy.current = t.unavailable;

  const start = useCallback(async () => {
    setStage({ kind: "loading" });
    currentTx.current = null;
    try {
      const res = await fetch("/api/powertranz/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, locale }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 503 || data?.code === "not_configured") {
        setStage({ kind: "unavailable" });
        return;
      }
      if (!res.ok || !data?.redirectData || !data?.transactionId) {
        setStage({ kind: "failed", message: data?.error || unavailableCopy.current, canRetry: res.status !== 409 });
        return;
      }
      currentTx.current = data.transactionId;
      setStage({ kind: "iframe", tx: data.transactionId, html: data.redirectData });
    } catch {
      setStage({ kind: "failed", message: unavailableCopy.current, canRetry: true });
    }
  }, [bookingId, locale]);

  useEffect(() => {
    start();
  }, [start]);

  // Outcome posted by the callback page rendered inside the iframe (same origin).
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const msg = event.data as ResultMessage | undefined;
      if (!msg || msg.type !== "powertranz:result") return;
      if (currentTx.current && msg.tx && msg.tx !== currentTx.current) return;
      if (msg.ok) {
        setStage({ kind: "approved" });
        onSuccessRef.current({ redirectUrl: msg.redirectUrl });
        return;
      }
      if (msg.status === "duplicate" && msg.tx) {
        setStage({ kind: "checking", tx: msg.tx });
        return;
      }
      setStage({ kind: "failed", message: msg.message, canRetry: true });
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  // Recovery: poll /status until the attempt settles.
  const checkingTx = stage.kind === "checking" ? stage.tx : null;
  useEffect(() => {
    if (!checkingTx) return;
    let cancelled = false;
    let attempts = 0;
    const tick = async () => {
      attempts += 1;
      try {
        const res = await fetch(`/api/powertranz/status?tx=${encodeURIComponent(checkingTx)}&lang=${locale}`, { cache: "no-store" });
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (data?.ok) {
          setStage({ kind: "approved" });
          onSuccessRef.current({ redirectUrl: data.redirectUrl });
          return;
        }
        if (data?.status && data.status !== "initiated" && data.status !== "authenticating") {
          setStage({ kind: "failed", message: data.message || unavailableCopy.current, canRetry: true });
          return;
        }
      } catch {
        /* keep polling */
      }
      if (attempts < 10) setTimeout(tick, 2000);
      else setStage({ kind: "failed", message: unavailableCopy.current, canRetry: true });
    };
    tick();
    return () => {
      cancelled = true;
    };
  }, [checkingTx, locale]);

  const requestPayLater = async () => {
    setPayLaterState("sending");
    try {
      const res = await fetch("/api/powertranz/pay-later", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });
      if (!res.ok) throw new Error("pay-later failed");
      setPayLaterState("sent");
      onPayLater?.();
    } catch {
      setPayLaterState("failed");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 text-xs text-foreground/60">
        <div className="flex items-center gap-2">
          <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
          </svg>
          <span>{t.trustHeader}</span>
        </div>
        <span className="font-semibold text-foreground">{t.amount(amount.toFixed(2))}</span>
      </div>

      {(stage.kind === "loading" || stage.kind === "checking") && (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-foreground/60">
          <Spinner />
          <p className="text-sm">{stage.kind === "loading" ? t.loading : t.checking}</p>
        </div>
      )}

      {stage.kind === "approved" && (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-green-700">
          <p className="text-sm font-semibold">{t.approved}</p>
        </div>
      )}

      {stage.kind === "iframe" && (
        <div className="overflow-hidden rounded-2xl border border-black/5 bg-white">
          {/* RedirectData is a complete HTML document from Powertranz. srcDoc
              keeps it same-origin so the callback page can reach
              window.parent; the form inside posts to Powertranz / the bank. */}
          <iframe
            key={stage.tx}
            title="Secure payment — Powertranz"
            srcDoc={stage.html}
            className="w-full border-0"
            style={{ minHeight: 720 }}
            allow="payment"
          />
        </div>
      )}

      {stage.kind === "failed" && (
        <div className="space-y-3 rounded-2xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-900">{t.failedTitle}</p>
          <p className="text-sm text-red-800">{stage.message}</p>
          <p className="rounded-md border border-red-100 bg-white/60 p-2.5 text-xs text-red-800/90">{t.bankTip}</p>
          {stage.canRetry && (
            <button
              type="button"
              onClick={start}
              className="w-full rounded-xl bg-sunset-orange px-4 py-3 text-sm font-semibold text-white transition hover:bg-sunset-gold"
            >
              {t.retry}
            </button>
          )}
        </div>
      )}

      {stage.kind === "unavailable" && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm text-amber-900">{t.unavailable}</p>
        </div>
      )}

      {/* Payment-link fallback — ONLY once the card step failed or the gateway is unavailable. */}
      {(stage.kind === "failed" || stage.kind === "unavailable") && (
        <div className="space-y-2">
          {payLaterState === "sent" ? (
            <p className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-800">{t.payLaterSent}</p>
          ) : (
            <button
              type="button"
              onClick={requestPayLater}
              disabled={payLaterState === "sending"}
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-foreground transition hover:border-sunset-orange hover:text-sunset-orange disabled:opacity-60"
            >
              {payLaterState === "sending" ? t.sending : stage.kind === "unavailable" ? t.payLaterUnavailable : t.payLater}
            </button>
          )}
          {payLaterState === "failed" && <p className="text-xs text-red-700">{t.payLaterFailed}</p>}
        </div>
      )}

      <div className="flex flex-col justify-between gap-3 border-t border-black/5 pt-3 text-[11px] text-foreground/50 sm:flex-row sm:items-center">
        <span>🔒 {t.hostedNote}</span>
        <PaymentBadges locale={locale} variant="checkout" className="shrink-0" />
      </div>
    </div>
  );
}
