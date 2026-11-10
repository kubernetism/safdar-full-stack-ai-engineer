"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { TodoBox } from "../components/glyphs";
import styles from "./fde.module.css";

export type ChecklistItem = { slug: string; sourceId: string; title: string; pct: string; tier: string };
export type ChecklistGroup = {
  id: string;
  name: string;
  short: string;
  tiers: { name: string; items: ChecklistItem[] }[];
};

const KEY = "fde-checklist:v1";
const EMPTY: readonly string[] = [];
let cachedRaw: string | null = null;
let cachedValue: readonly string[] = EMPTY;
const listeners = new Set<() => void>();

function read(): readonly string[] {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    return EMPTY; // storage blocked: progress just is not remembered
  }
  if (raw === cachedRaw) return cachedValue;
  cachedRaw = raw;
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    cachedValue = Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : EMPTY;
  } catch {
    cachedValue = EMPTY;
  }
  return cachedValue;
}

function write(next: readonly string[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage blocked or full: keep going without persistence.
    cachedRaw = JSON.stringify(next);
    cachedValue = next;
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function Progress({ done, total, label }: { done: number; total: number; label: string }) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  return (
    <div className={styles.progress}>
      <span className={styles.progressLabel}>
        {done}/{total}
      </span>
      <div
        className={styles.bar}
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={done}
      >
        <div className={styles.barFill} style={{ width: `${pct}%` }} />
      </div>
      <span className={styles.progressPct}>{pct}%</span>
    </div>
  );
}

/**
 * The full checklist with progress saved in this browser (localStorage).
 * The server renders everything unchecked; saved ticks appear after hydration.
 */
export function FdeChecklist({ groups }: { groups: ChecklistGroup[] }) {
  const done = useSyncExternalStore(subscribe, read, () => EMPTY);
  const [armed, setArmed] = useState(false);
  const doneSet = new Set(done);
  const all = groups.flatMap((g) => g.tiers.flatMap((t) => t.items));
  const total = all.length;
  const doneCount = all.filter((i) => doneSet.has(i.sourceId)).length;

  function toggle(id: string) {
    const next = doneSet.has(id) ? done.filter((d) => d !== id) : [...done, id];
    write(next);
  }

  return (
    <div className={styles.checklist}>
      <div className={styles.overall}>
        <p className={styles.overallLabel}>
          {doneCount} of {total} skills
        </p>
        <Progress done={doneCount} total={total} label="Overall progress" />
        <button
          type="button"
          className={`btn btn--ghost ${styles.reset}`}
          data-armed={armed ? "" : undefined}
          onClick={() => {
            if (!armed) {
              setArmed(true);
              return;
            }
            write([]);
            setArmed(false);
          }}
          onBlur={() => setArmed(false)}
        >
          {armed ? "Click again to clear" : "Reset"}
        </button>
        <p className={styles.saveNote}>Progress saves in this browser only.</p>
      </div>

      <div className={styles.groups}>
        {groups.map((group) => {
          const groupItems = group.tiers.flatMap((t) => t.items);
          const groupDone = groupItems.filter((i) => doneSet.has(i.sourceId)).length;
          return (
            <section key={group.id} className={`tool ${styles.group}`} aria-labelledby={`cl-${group.id}`}>
              <div className="tool__head">
                <span className={styles.groupShort}>{group.short}</span>
                <span className="tool__status">
                  {groupDone}/{groupItems.length}
                </span>
              </div>
              <div className={styles.groupBody}>
                <h3 id={`cl-${group.id}`} className={styles.groupName}>
                  {group.name}
                </h3>
                <Progress done={groupDone} total={groupItems.length} label={`${group.name} progress`} />
                {group.tiers.map((tier) => (
                  <div key={tier.name}>
                    <p className={styles.tierRule}>{tier.name}</p>
                    <ul className={styles.todo} role="list">
                      {tier.items.map((item) => {
                        const checked = doneSet.has(item.sourceId);
                        return (
                          <li key={item.slug} data-done={checked ? "" : undefined}>
                            <label className={styles.todoLabel}>
                              <input
                                type="checkbox"
                                className={styles.todoInput}
                                checked={checked}
                                onChange={() => toggle(item.sourceId)}
                              />
                              <TodoBox checked={checked} />
                              <span className={styles.todoText}>{item.title}</span>
                            </label>
                            <Link
                              className={styles.todoLink}
                              href={`/fde/${item.slug}`}
                              aria-label={`Study notes: ${item.title}`}
                            >
                              {item.pct}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
