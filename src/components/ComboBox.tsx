"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { matchesSubstring, matchesWordStart, queryTokens } from "@/lib/hotels";
import { useLocale } from "@/components/LocaleProvider";
import { BOOKING } from "@/i18n/booking";

export interface ComboOption {
  value: string;
  label: string;
  group?: string;
  /** Secondary line under the label (e.g. the route point a hotel resolves to). */
  hint?: string;
}

interface Props {
  options: ComboOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  emptyText?: string;
  /**
   * Extra suggestions for a query that the plain label filter cannot find —
   * hotel and landmark names resolved to their route point. Called with the
   * raw query; results are appended after the direct matches.
   */
  extraMatches?: (query: string) => ComboOption[];
  /**
   * Called (debounced) when a non-trivial query produces zero results, so we
   * can learn which hotels guests look for and never find.
   */
  onNoMatch?: (query: string) => void;
}

const NO_MATCH_MIN_LENGTH = 4;
const NO_MATCH_DEBOUNCE_MS = 1200;

function optionKey(opt: ComboOption): string {
  return `${opt.value}|${opt.hint ?? ""}`;
}

/**
 * Typeable combobox with grouped options and keyboard navigation.
 *
 * Matching is forgiving on purpose: accents and punctuation are ignored and
 * every typed word only has to START a word of the label ("coco" → Playas
 * del Coco, "san jose" → San José). When that finds nothing, a plain
 * substring match is tried before giving up. Preserves the order the options
 * were provided in, both for grouping and for filtering.
 */
export default function ComboBox({
  options,
  value,
  onChange,
  placeholder,
  disabled = false,
  emptyText,
  extraMatches,
  onNoMatch,
}: Props) {
  const locale = useLocale();
  const t = BOOKING[locale].combo;
  const placeholderText = placeholder ?? t.placeholder;
  const emptyMessage = emptyText ?? t.empty;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlighted, setHighlighted] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const listId = useId();

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
  const { grouped, flat } = useMemo(() => {
    const tokens = queryTokens(query);
    let filtered: ComboOption[];

    if (tokens.length === 0) {
      filtered = options;
    } else {
      const direct = options.filter((o) => matchesWordStart(tokens, o.label));
      const directValues = new Set(direct.map((o) => o.value));
      const seen = new Set<string>();
      const extras: ComboOption[] = [];
      for (const opt of extraMatches?.(query) ?? []) {
        if (directValues.has(opt.value)) continue;
        const key = optionKey(opt);
        if (seen.has(key)) continue;
        seen.add(key);
        extras.push(opt);
      }
      filtered = [...direct, ...extras];
      if (filtered.length === 0) {
        filtered = options.filter((o) => matchesSubstring(query, o.label));
      }
    }

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
    return { grouped: result, flat: filtered };
  }, [options, query, extraMatches]);

  // Keep the highlighted row visible while arrowing through a long list.
  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector<HTMLElement>(
      `[data-index="${highlighted}"]`
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [highlighted, open]);

  // Report searches that find nothing (debounced, non-trivial queries only).
  useEffect(() => {
    if (!onNoMatch || !open) return;
    const q = query.trim();
    if (q.length < NO_MATCH_MIN_LENGTH || flat.length > 0) return;
    const id = window.setTimeout(() => onNoMatch(q), NO_MATCH_DEBOUNCE_MS);
    return () => window.clearTimeout(id);
  }, [query, flat.length, open, onNoMatch]);

  function select(opt: ComboOption) {
    onChange(opt.value);
    setQuery("");
    setOpen(false);
  }

  function onInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter") setOpen(true);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, flat.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      const opt = flat[highlighted];
      if (opt) {
        e.preventDefault();
        select(opt);
      }
    } else if (e.key === "Tab") {
      setOpen(false);
      setQuery("");
    }
  }

  const displayValue = open ? query : selectedLabel;
  let rowIndex = -1;

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
          placeholder={placeholderText}
          value={displayValue}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          onChange={(e) => {
            setQuery(e.target.value);
            setHighlighted(0);
            if (!open) setOpen(true);
          }}
          onFocus={() => {
            setOpen(true);
            setQuery("");
            setHighlighted(0);
          }}
          onKeyDown={onInputKeyDown}
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
            aria-label={t.clear}
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
        <div
          ref={listRef}
          id={listId}
          role="listbox"
          className="absolute left-0 right-0 top-full z-30 mt-2 max-h-72 overflow-y-auto rounded-xl border border-black/5 bg-white p-1 shadow-2xl"
        >
          {grouped.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-foreground/40">
              {emptyMessage}
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
                  rowIndex += 1;
                  const index = rowIndex;
                  const active = opt.value === value && !opt.hint;
                  const focused = index === highlighted;
                  return (
                    <button
                      key={optionKey(opt)}
                      type="button"
                      role="option"
                      aria-selected={active}
                      data-index={index}
                      onMouseDown={(e) => e.preventDefault()}
                      onMouseEnter={() => setHighlighted(index)}
                      onClick={() => select(opt)}
                      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
                        active
                          ? "bg-sunset-orange/10 text-sunset-orange"
                          : focused
                            ? "bg-sunset-orange/5 text-sunset-orange"
                            : "text-foreground"
                      }`}
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate">{opt.label}</span>
                        {opt.hint && (
                          <span className="block truncate text-xs font-normal text-foreground/50">
                            {opt.hint}
                          </span>
                        )}
                      </span>
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
