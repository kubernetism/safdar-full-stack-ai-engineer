/**
 * Terminal glyphs drawn as CSS/SVG. The self-hosted Geist subsets do not
 * include ●, ⎿, ✻, → or ✓, and system fallbacks render them at random
 * widths, so they are drawn here to stay crisp and aligned everywhere.
 */

export function Dot({ tone = "add" }: { tone?: "add" | "accent" | "mute" }) {
  const background = tone === "accent" ? "var(--accent)" : tone === "mute" ? "var(--bone-mute)" : undefined;
  return <span className="g-dot" style={background ? { background } : undefined} aria-hidden="true" />;
}

export function Elbow() {
  return <span className="g-elbow" aria-hidden="true" />;
}

export function Cursor({ blink = true }: { blink?: boolean }) {
  return <span className="g-cursor" data-blink={blink ? "" : undefined} aria-hidden="true" />;
}

export function TodoBox({ checked = false }: { checked?: boolean }) {
  return <span className="g-box" data-checked={checked ? "" : undefined} aria-hidden="true" />;
}

/** Six-armed spark, the ✻ of the session spinner. */
export function Spark({ className, size = "1em" }: { className?: string; size?: string }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.2"
      strokeLinecap="square"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 2v20M3.3 7l17.4 10M3.3 17l17.4-10" />
    </svg>
  );
}

export function Arrow({
  direction = "right",
  size = "1em",
}: {
  direction?: "right" | "left" | "up-right";
  size?: string;
}) {
  const rotate = direction === "left" ? 180 : direction === "up-right" ? -45 : 0;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="square"
      style={{ transform: `rotate(${rotate}deg)`, flex: "none" }}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M3 12h17M13 5l7 7-7 7" />
    </svg>
  );
}

export function Check({ size = "1em" }: { size?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="square"
      style={{ flex: "none" }}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4 12.5l5 5L20 6.5" />
    </svg>
  );
}
