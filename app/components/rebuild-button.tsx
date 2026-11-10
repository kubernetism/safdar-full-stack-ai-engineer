"use client";

import { useRouter } from "next/navigation";
import { Spark } from "./glyphs";

export const REPLAY_EVENT = "intro:replay";
export const REPLAY_FLAG = "intro:replay";

/**
 * "/rebuild" replays the hero build animation. On the home page it signals
 * the intro directly; elsewhere it leaves a flag and navigates home, where
 * the intro controller picks the flag up.
 */
export function RebuildButton({ className }: { className?: string }) {
  const router = useRouter();

  function rebuild() {
    if (document.getElementById("intro")) {
      window.scrollTo({ top: 0, behavior: "instant" });
      window.dispatchEvent(new Event(REPLAY_EVENT));
      return;
    }
    try {
      sessionStorage.setItem(REPLAY_FLAG, "1");
    } catch {
      // Storage blocked: navigate anyway, the visitor just lands on the built page.
    }
    router.push("/");
  }

  return (
    <button type="button" className={className} onClick={rebuild} aria-label="Replay the build animation">
      <Spark size="0.95em" />
      <span aria-hidden="true">/rebuild</span>
    </button>
  );
}
