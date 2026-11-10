"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./palette-search.module.css";

export type PaletteEntry = {
  key: string;
  href: string;
  /** Small mono label on the left, such as "06 /system-design". */
  kicker: string;
  name: string;
  summary: string;
  /** Extra words that should match but are not shown. */
  keywords?: string;
};

function matches(entry: PaletteEntry, terms: string[]) {
  const haystack = `${entry.name} ${entry.summary} ${entry.kicker} ${entry.keywords ?? ""}`.toLowerCase();
  return terms.every((t) => haystack.includes(t));
}

/**
 * "/" palette that filters a list of entries. With an empty query it shows the
 * server-rendered children; with a query it lists matches instead.
 */
export function PaletteSearch({
  entries,
  children,
  placeholder,
  noun,
  label,
}: {
  entries: readonly PaletteEntry[];
  children: ReactNode;
  placeholder: string;
  /** Plural noun for the status line, e.g. "patterns". */
  noun: string;
  label: string;
}) {
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query);
  const inputRef = useRef<HTMLInputElement>(null);

  // "/" focuses the search from anywhere on the page, like a command palette.
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const typing = target?.closest("input, textarea, select, [contenteditable='true']");
      if (event.key === "/" && !typing && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const terms = deferred.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const results = terms.length ? entries.filter((entry) => matches(entry, terms)) : [];
  const searching = terms.length > 0;

  return (
    <>
      <div className={styles.searchBar}>
        <div className="shell">
          <label className={styles.search}>
            <span className={styles.searchSlash} aria-hidden="true">
              /
            </span>
            <span className="sr-only">{label}</span>
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") setQuery("");
              }}
              placeholder={placeholder}
              autoComplete="off"
              spellCheck={false}
            />
            <kbd className={styles.searchKbd} aria-hidden="true">
              /
            </kbd>
          </label>
          <p className={styles.searchStatus} aria-live="polite">
            {searching
              ? `${results.length} ${results.length === 1 ? "match" : "matches"} for “${deferred.trim()}”`
              : `${entries.length} ${noun} · type to filter`}
          </p>
        </div>
      </div>

      {searching ? (
        <div className="shell">
          {results.length ? (
            <ol className={styles.results} role="list">
              {results.map((r) => (
                <li key={r.key}>
                  <Link className={styles.result} href={r.href}>
                    <span className={styles.resultCat}>{r.kicker}</span>
                    <span className={styles.resultName}>{r.name}</span>
                    <span className={styles.resultSummary}>{r.summary}</span>
                  </Link>
                </li>
              ))}
            </ol>
          ) : (
            <p className={styles.noResults}>
              Nothing matches that. Try a broader word, or press <kbd>esc</kbd> to clear.
            </p>
          )}
        </div>
      ) : null}

      <div hidden={searching}>{children}</div>
    </>
  );
}
