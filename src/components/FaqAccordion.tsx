"use client";

import { useState } from "react";

export interface Faq {
  id: string;
  category: string;
  question: string;
  answer: string;
}

interface Props {
  faqs: Faq[];
  /**
   * When true, the first item is expanded on mount.
   * Useful for short lists (e.g. on a route page).
   */
  defaultOpenFirst?: boolean;
}

export default function FaqAccordion({ faqs, defaultOpenFirst = false }: Props) {
  const [openId, setOpenId] = useState<string | null>(
    defaultOpenFirst && faqs.length > 0 ? faqs[0].id : null
  );

  if (faqs.length === 0) {
    return (
      <p className="text-center text-sm text-foreground/50">
        No FAQs available right now.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-black/5 overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
      {faqs.map((faq) => {
        const isOpen = openId === faq.id;
        return (
          <li key={faq.id}>
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : faq.id)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-sunset-orange/5 sm:px-6 sm:py-5"
            >
              <span className="text-sm font-semibold text-foreground sm:text-base">
                {faq.question}
              </span>
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sunset-orange/10 text-sunset-orange transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </span>
            </button>
            <div
              className={`grid overflow-hidden transition-all duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="whitespace-pre-line px-5 pb-5 text-sm leading-relaxed text-foreground/70 sm:px-6 sm:pb-6">
                  {faq.answer}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
