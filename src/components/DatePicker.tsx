"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  value: string; // ISO date YYYY-MM-DD
  onChange: (iso: string) => void;
  minDate?: Date;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEK_DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function toISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function stripTime(d: Date): Date {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function DatePicker({ value, onChange, minDate }: Props) {
  const today = stripTime(new Date());
  const min = minDate ? stripTime(minDate) : today;

  const selected = value ? new Date(value + "T00:00:00") : null;

  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => {
    const d = selected ?? new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close on outside click
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

  // Build 42 day cells for the current view
  const firstDay = new Date(view.year, view.month, 1);
  const startDayOfWeek = firstDay.getDay();
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();

  const cells: { date: Date; inMonth: boolean }[] = [];
  // Leading days from previous month
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    cells.push({
      date: new Date(view.year, view.month, -i),
      inMonth: false,
    });
  }
  // Days in current month
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({
      date: new Date(view.year, view.month, d),
      inMonth: true,
    });
  }
  // Trailing days from next month
  while (cells.length < 42) {
    const last = cells[cells.length - 1].date;
    const next = new Date(last);
    next.setDate(next.getDate() + 1);
    cells.push({ date: next, inMonth: false });
  }

  function prevMonth() {
    setView((v) =>
      v.month === 0
        ? { year: v.year - 1, month: 11 }
        : { ...v, month: v.month - 1 }
    );
  }
  function nextMonth() {
    setView((v) =>
      v.month === 11
        ? { year: v.year + 1, month: 0 }
        : { ...v, month: v.month + 1 }
    );
  }

  const displayValue = selected
    ? selected.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Select a date";

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
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
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
            />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-foreground/40">
            Pickup Date
          </div>
          <div
            className={`mt-1 text-base font-bold ${
              selected ? "text-foreground" : "text-foreground/40"
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
          role="dialog"
          className="absolute left-0 right-0 top-full z-30 mt-2 w-full min-w-[320px] origin-top rounded-2xl border border-black/5 bg-white p-4 shadow-2xl sm:left-auto sm:w-[340px]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-1">
            <button
              type="button"
              onClick={prevMonth}
              className="flex h-9 w-9 items-center justify-center rounded-full text-foreground/60 transition hover:bg-sunset-orange/10 hover:text-sunset-orange"
              aria-label="Previous month"
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
                  d="M15.75 19.5 8.25 12l7.5-7.5"
                />
              </svg>
            </button>
            <div className="text-sm font-bold text-foreground">
              {MONTHS[view.month]} {view.year}
            </div>
            <button
              type="button"
              onClick={nextMonth}
              className="flex h-9 w-9 items-center justify-center rounded-full text-foreground/60 transition hover:bg-sunset-orange/10 hover:text-sunset-orange"
              aria-label="Next month"
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
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          </div>

          {/* Week days */}
          <div className="mt-3 grid grid-cols-7 gap-1">
            {WEEK_DAYS.map((d) => (
              <div
                key={d}
                className="py-1 text-center text-[0.65rem] font-bold uppercase tracking-wider text-foreground/40"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="mt-1 grid grid-cols-7 gap-1">
            {cells.map((cell, i) => {
              const cellStripped = stripTime(cell.date);
              const isSel = selected && isSameDay(cell.date, selected);
              const isDisabled = cellStripped < min;
              const isToday = isSameDay(cell.date, today);

              let className =
                "h-10 rounded-lg text-sm font-semibold transition relative ";
              if (isSel) {
                className +=
                  "bg-gradient-to-br from-sunset-red via-sunset-orange to-sunset-gold text-white shadow-md shadow-sunset-orange/30";
              } else if (isDisabled) {
                className +=
                  "text-foreground/20 cursor-not-allowed";
              } else if (!cell.inMonth) {
                className +=
                  "text-foreground/25 hover:bg-sunset-orange/5 hover:text-sunset-orange";
              } else if (isToday) {
                className +=
                  "text-sunset-orange ring-1 ring-sunset-orange/40 hover:bg-sunset-orange/10";
              } else {
                className +=
                  "text-foreground hover:bg-sunset-orange/10 hover:text-sunset-orange";
              }

              return (
                <button
                  key={i}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => {
                    onChange(toISO(cell.date));
                    setOpen(false);
                  }}
                  className={className}
                >
                  {cell.date.getDate()}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-3 flex items-center justify-between border-t border-black/5 pt-3 text-xs">
            <button
              type="button"
              onClick={() => {
                onChange(toISO(today));
                setView({
                  year: today.getFullYear(),
                  month: today.getMonth(),
                });
                setOpen(false);
              }}
              className="font-semibold text-sunset-orange transition hover:text-sunset-gold"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="font-semibold text-foreground/50 transition hover:text-foreground"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
