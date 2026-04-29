"use client";

import { useState } from "react";
import PhoneInput from "@/components/PhoneInput";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    setErrorMessage(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone: phone || undefined,
          subject: subject || undefined,
          message,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(data?.error ?? "Could not send your message.");
      }
      setStatus("success");
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Could not send your message. Please try WhatsApp instead.",
      );
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-3xl border border-green-200 bg-green-50 p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white">
          <svg
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-bold text-foreground">Message sent</h3>
        <p className="mt-2 text-sm text-foreground/70">
          Thanks — we&apos;ve received your message and will reply shortly. Check your
          inbox for a confirmation.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-5 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-sunset-orange hover:text-sunset-orange"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:p-8"
    >
      <h3 className="text-lg font-bold text-foreground">Send us a message</h3>
      <p className="mt-1 text-sm text-foreground/60">
        We&apos;ll reply within a few hours during the day.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label
            htmlFor="contact-name"
            className="text-sm font-medium text-foreground/70"
          >
            Full name
          </label>
          <input
            id="contact-name"
            type="text"
            required
            maxLength={200}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full rounded-xl border border-black/10 bg-light-surface px-4 py-3 text-sm text-foreground outline-none transition focus:border-sunset-orange focus:ring-2 focus:ring-sunset-orange/20"
          />
        </div>
        <div>
          <label
            htmlFor="contact-email"
            className="text-sm font-medium text-foreground/70"
          >
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            required
            maxLength={200}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-xl border border-black/10 bg-light-surface px-4 py-3 text-sm text-foreground outline-none transition focus:border-sunset-orange focus:ring-2 focus:ring-sunset-orange/20"
          />
        </div>
        <div>
          <label
            htmlFor="contact-phone"
            className="text-sm font-medium text-foreground/70"
          >
            Phone / WhatsApp{" "}
            <span className="text-foreground/40">(optional)</span>
          </label>
          <div className="mt-2">
            <PhoneInput id="contact-phone" value={phone} onChange={setPhone} />
          </div>
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor="contact-subject"
            className="text-sm font-medium text-foreground/70"
          >
            Subject <span className="text-foreground/40">(optional)</span>
          </label>
          <input
            id="contact-subject"
            type="text"
            maxLength={200}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Reservation question, custom itinerary, group quote…"
            className="mt-2 w-full rounded-xl border border-black/10 bg-light-surface px-4 py-3 text-sm text-foreground outline-none transition focus:border-sunset-orange focus:ring-2 focus:ring-sunset-orange/20"
          />
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor="contact-message"
            className="text-sm font-medium text-foreground/70"
          >
            Message
          </label>
          <textarea
            id="contact-message"
            required
            rows={5}
            maxLength={5000}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us about your trip, dates, and number of travelers…"
            className="mt-2 w-full resize-none rounded-xl border border-black/10 bg-light-surface px-4 py-3 text-sm text-foreground outline-none transition focus:border-sunset-orange focus:ring-2 focus:ring-sunset-orange/20"
          />
        </div>
      </div>

      {status === "error" && errorMessage && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sunset-red via-sunset-orange to-sunset-gold px-8 py-4 text-sm font-bold text-white shadow-lg shadow-sunset-orange/25 transition hover:shadow-xl hover:shadow-sunset-orange/40 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {status === "submitting" ? (
          "Sending…"
        ) : (
          <>
            Send message
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
              />
            </svg>
          </>
        )}
      </button>
    </form>
  );
}
