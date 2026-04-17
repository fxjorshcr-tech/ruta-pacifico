"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  value: string; // HH:mm
  onChange: (time: string) => void;
  /** Interval in minutes between slots (default 15) */
  stepMinutes?: number;
}

function generateSlots(step: number): string[] {
  const slots: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += step) {
      const hh = String(h).padStart(2, "0");
      const mm = String(m).padStart(2, "0");
      slots.push(`${hh}:${mm}`);
    }
  }
  return slots;
}

function formatSlot(time: string): string {
  if (!time) return "";
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${displayH}:${String(m).padStart(2, "0")} ${period}`;
}

export default function TimePicker({
  value,
  onChange,
  stepMinutes = 15,
}: Props) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const slots = generateSlots(stepMinutes);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  // When opening, center the selected (or 09:00 default) slot inside the list.
  // We set scrollTop directly on the inner container so the scroll stays
  // contained and never bubbles up to the page (which, combined with the
  // global `scroll-behavior: smooth`, used to yank the whole page).
  useEffect(() => {
    if (!open) return;
    const list = listRef.current;
    if (!list) return;
    const target = value || "09:00";
    const el = list.querySelector<HTMLButtonElement>(`[data-slot="${target}"]`);
    if (!el) return;
    const nextTop =
      el.offsetTop - list.clientHeight / 2 + el.clientHeight / 2;
    list.scrollTop = Math.max(0, nextTop);
  }, [open, value]);

  const displayValue = value ? formatSlot(value) : "Select a time";

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`group flex w-full cursor-pointer items-center gap-4 overflow-hidden rounded-2xl border-2 bg-white p-5 text-left transition ${
          open
            ? "border-sunset-orange ring-4 ring-sunset-orange/15"
            : "border-black/5 hover:border-sunset-orange/40 hover:shadow-md"
        }`}
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sunset-orange/20 to-sunset-gold/20 text-sunset-orange">
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-foreground/40">
            Pickup Time
          </div>
          <div
            className={`mt-1 text-base font-bold ${
              value ? "text-foreground" : "text-foreground/40"
            }`}
          >
            {displayValue}
          </div>
        </div>
        <svg
          className={`h-5 w-5 shrink-0 text-foreground/30 transition ${
            open ? "rotate-180 text-sunset-orange" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m19.5 8.25-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-full z-30 mt-2 w-full min-w-[240px] rounded-2xl border border-black/5 bg-white p-2 shadow-2xl sm:left-auto sm:w-[240px]"
        >
          <div
            ref={listRef}
            className="max-h-64 overflow-y-auto pr-1"
            style={{ scrollbarWidth: "thin" }}
          >
            {slots.map((slot) => {
              const active = slot === value;
              return (
                <button
                  key={slot}
                  data-slot={slot}
                  type="button"
                  onClick={() => {
                    onChange(slot);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                    active
                      ? "bg-gradient-to-r from-sunset-red via-sunset-orange to-sunset-gold text-white shadow-sm"
                      : "text-foreground hover:bg-sunset-orange/10 hover:text-sunset-orange"
                  }`}
                >
                  <span>{formatSlot(slot)}</span>
                  {active && (
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={3}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m4.5 12.75 6 6 9-13.5"
                      />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
