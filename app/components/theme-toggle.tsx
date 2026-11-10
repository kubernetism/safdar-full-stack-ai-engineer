"use client";

import { useLayoutEffect } from "react";
import { THEME_KEY, type Theme } from "./theme";

function storedTheme(): Theme | null {
  try {
    const value = localStorage.getItem(THEME_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

function systemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

/**
 * "/light" or "/dark": the command you would run. Both labels are rendered
 * and CSS shows the right one from <html data-theme>, so the server markup
 * never depends on the visitor's theme (no hydration mismatch).
 */
export function ThemeToggle({ className, labelClassName }: { className?: string; labelClassName?: string }) {
  useLayoutEffect(() => {
    // Re-apply after React's dev remount clears <html> attributes; no-op in production.
    applyTheme(storedTheme() ?? systemTheme());

    // Follow the system setting until the visitor picks a theme.
    const media = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = () => {
      if (!storedTheme()) applyTheme(systemTheme());
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  function toggle() {
    const next: Theme = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
    applyTheme(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // Storage blocked: the switch still applies for this page view.
    }
  }

  return (
    <button type="button" className={className} onClick={toggle} data-theme-toggle>
      <span className={labelClassName} data-show-in="dark">
        <SunIcon />
        <span aria-hidden="true">/light</span>
        <span className="sr-only">Switch to light theme</span>
      </span>
      <span className={labelClassName} data-show-in="light">
        <MoonIcon />
        <span aria-hidden="true">/dark</span>
        <span className="sr-only">Switch to dark theme</span>
      </span>
    </button>
  );
}

function SunIcon() {
  return (
    <svg
      width="0.95em"
      height="0.95em"
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M6 5h4v1h1v4h-1v1H6v-1H5V6h1zM7 0h2v3H7zM7 13h2v3H7zM0 7h3v2H0zM13 7h3v2h-3zM2 2h2v2H2zM12 2h2v2h-2zM2 12h2v2H2zM12 12h2v2h-2z"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="0.95em"
      height="0.95em"
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M6 1h4v1H8v1H7v2H6v4h1v2h1v1h2v1h3v1h-1v1h-2v1H6v-1H4v-1H3v-1H2v-2H1V6h1V4h1V3h1V2h2z"
      />
    </svg>
  );
}
