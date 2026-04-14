"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export interface ComboOption {
  value: string;
  label: string;
  group?: string;
}

interface Props {
  options: ComboOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  emptyText?: string;
}

/**
 * Typeable combobox with grouped options. Preserves the order the options
 * were provided in, both for grouping and for filtering.
 */
export default function ComboBox({
  options,
  value,
  onChange,
  placeholder = "Search...",
  disabled = false,
  emptyText = "No matches found",
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedLabel = useMemo(
    () => options.find((o) => o.value === value)?.label ?? "",
    [value, options]
  );

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setQuery("");
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
        inputRef.current?.blur();
      }
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Filter + group, preserving original input order
  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? options.filter((o) => o.label.toLowerCase().includes(q))
      : options;

    const result: Array<[string | null, ComboOption[]]> = [];
    const index = new Map<string | null, number>();

    for (const opt of filtered) {
      const key = opt.group ?? null;
      if (!index.has(key)) {
        index.set(key, result.length);
        result.push([key, []]);
      }
      result[index.get(key)!][1].push(opt);
    }
    return result;
  }, [options, query]);

  const displayValue = open ? query : selectedLabel;

  return (
    <div ref={wrapperRef} className="relative">
      <div
        className={`flex items-center gap-2 rounded-xl border-2 bg-light-surface px-4 py-3 transition ${
          disabled
            ? "cursor-not-allowed border-black/5 opacity-50"
            : open
            ? "border-sunset-orange bg-white ring-4 ring-sunset-orange/15"
            : "border-black/5 hover:border-sunset-orange/40"
        }`}
      >
        <svg
          className="h-4 w-4 shrink-0 text-foreground/40"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
        <input
          ref={inputRef}
          type="text"
          disabled={disabled}
          placeholder={placeholder}
          value={displayValue}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!open) setOpen(true);
          }}
          onFocus={() => {
            setOpen(true);
            setQuery("");
          }}
          className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-foreground/40 disabled:cursor-not-allowed"
        />
        {value && !open && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange("");
              setQuery("");
              inputRef.current?.focus();
            }}
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-foreground/30 transition hover:bg-black/5 hover:text-foreground"
            aria-label="Clear selection"
          >
            <svg
              className="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
        <svg
          className={`h-4 w-4 shrink-0 text-foreground/40 transition ${
            open ? "rotate-180" : ""
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
      </div>

      {open && !disabled && (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-72 overflow-y-auto rounded-xl border border-black/5 bg-white p-1 shadow-2xl">
          {grouped.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-foreground/40">
              {emptyText}
            </div>
          ) : (
            grouped.map(([groupName, opts]) => (
              <div key={groupName ?? "default"}>
                {groupName && (
                  <div className="sticky top-0 bg-white px-3 pt-3 pb-1 text-[0.65rem] font-bold uppercase tracking-wider text-foreground/40">
                    {groupName}
                  </div>
                )}
                {opts.map((opt) => {
                  const active = opt.value === value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        onChange(opt.value);
                        setQuery("");
                        setOpen(false);
                      }}
                      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
                        active
                          ? "bg-sunset-orange/10 text-sunset-orange"
                          : "text-foreground hover:bg-sunset-orange/5 hover:text-sunset-orange"
                      }`}
                    >
                      <span className="flex-1">{opt.label}</span>
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
            ))
          )}
        </div>
      )}
    </div>
  );
}
