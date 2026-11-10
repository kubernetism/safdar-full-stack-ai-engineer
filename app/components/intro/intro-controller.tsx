"use client";

import { useLayoutEffect } from "react";
import { REPLAY_EVENT, REPLAY_FLAG } from "../rebuild-button";

declare global {
  interface Window {
    __introT0?: number;
  }
}

const SKIP_FADE_MS = 260;

/**
 * Adds behaviour to the CSS-driven intro: Skip, Esc, skip-on-interaction,
 * replay, focus handling and cleanup. The timeline itself is pure CSS, so
 * it starts at first paint and finishes on its own even if this never runs.
 *
 * States on the root: (none) hidden · play · skip (fading out) · done.
 */
export function IntroController({ rootId, durationMs }: { rootId: string; durationMs: number }) {
  // Layout effect: on remount (dev StrictMode, or <Activity> showing the page again)
  // a stale state must be settled before paint, or the CSS timeline would restart.
  useLayoutEffect(() => {
    const maybeRoot = document.getElementById(rootId);
    if (!maybeRoot) return;
    const root: HTMLElement = maybeRoot;
    const skipButton = root.querySelector<HTMLButtonElement>("[data-intro-skip]");

    let endTimer: number | undefined;
    let fadeTimer: number | undefined;
    let returnFocusTo: HTMLElement | null = null;

    const isPlaying = () => root.dataset.state === "play";

    function restoreFocus() {
      if (returnFocusTo && root.contains(document.activeElement)) {
        returnFocusTo.focus({ preventScroll: true });
      }
      returnFocusTo = null;
    }

    function finish() {
      window.clearTimeout(endTimer);
      window.clearTimeout(fadeTimer);
      detach();
      root.dataset.state = "done";
      restoreFocus();
    }

    function skip() {
      if (!isPlaying()) return;
      window.clearTimeout(endTimer);
      detach();
      root.dataset.state = "skip";
      fadeTimer = window.setTimeout(finish, SKIP_FADE_MS);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        skip();
        return;
      }
      // Let Tab move focus (focusin decides) and let the Skip button handle its own keys.
      if (event.key === "Tab" || event.key === "Shift" || event.target === skipButton) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      skip();
    }

    function onFocusIn(event: FocusEvent) {
      // Keyboard users who tab into the page are trying to use it: get out of the way.
      if (event.target instanceof Node && !root.contains(event.target)) skip();
    }

    function attach() {
      window.addEventListener("keydown", onKeyDown);
      window.addEventListener("wheel", skip, { passive: true });
      window.addEventListener("touchstart", skip, { passive: true });
      document.addEventListener("focusin", onFocusIn);
      root.addEventListener("pointerdown", skip);
    }

    function detach() {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("wheel", skip);
      window.removeEventListener("touchstart", skip);
      document.removeEventListener("focusin", onFocusIn);
      root.removeEventListener("pointerdown", skip);
    }

    function schedule(remainingMs: number) {
      window.clearTimeout(endTimer);
      endTimer = window.setTimeout(finish, Math.max(0, remainingMs));
    }

    function play() {
      window.clearTimeout(endTimer);
      window.clearTimeout(fadeTimer);
      detach();
      // Drop the state and force a style flush so every CSS animation restarts from zero.
      delete root.dataset.state;
      void root.offsetWidth;
      root.dataset.state = "play";
      window.__introT0 = performance.now();
      const active = document.activeElement;
      returnFocusTo = active instanceof HTMLElement && active !== document.body ? active : null;
      skipButton?.focus({ preventScroll: true });
      attach();
      schedule(durationMs);
    }

    const onSkipClick = () => skip();
    skipButton?.addEventListener("click", onSkipClick);
    window.addEventListener(REPLAY_EVENT, play);

    let replayRequested = false;
    try {
      replayRequested = sessionStorage.getItem(REPLAY_FLAG) === "1";
      if (replayRequested) sessionStorage.removeItem(REPLAY_FLAG);
    } catch {
      // Storage blocked: no replay hand-off from other pages.
    }

    if (replayRequested) {
      play();
    } else if (root.dataset.state === "skip") {
      finish();
    } else if (isPlaying()) {
      // Started by the boot script at first paint: only the remainder is left.
      const started = window.__introT0 ?? performance.now();
      const remaining = durationMs - (performance.now() - started);
      if (remaining <= 0) {
        finish();
      } else {
        attach();
        schedule(remaining);
      }
    }

    return () => {
      // Leave the state alone: a StrictMode remount follows at once, and a
      // remount after <Activity> settles it from the elapsed time above.
      skipButton?.removeEventListener("click", onSkipClick);
      window.removeEventListener(REPLAY_EVENT, play);
      detach();
      window.clearTimeout(endTimer);
      window.clearTimeout(fadeTimer);
    };
  }, [rootId, durationMs]);

  return null;
}
