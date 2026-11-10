/**
 * The hero build animation as data. Every time is in seconds from first
 * paint. intro.tsx turns this into DOM with per-element delays (--d, --s)
 * and generates the sprite's flight path keyframes from the block rects,
 * so the terminal, the preview and the sprite cannot drift apart.
 */

import { projects, systems } from "../../content";

export const PROMPT = "build safdar's portfolio. ship it.";

export const T = {
  banner: 0.3,
  promptStart: 0.55,
  promptEnd: 1.4,
  spriteIn: 1.55,
  styleStart: 4.35,
  styleSweep: 0.6,
  permissionIn: 5.05,
  permissionPick: 5.3,
  done: 6.1,
  exit: 6.5,
  end: 7.1,
} as const;

/** How long the overlay lives, used by the controller as a fallback timer. */
export const INTRO_DURATION_MS = Math.round(T.end * 1000);

export type ResultLine =
  | { kind: "note"; text: string }
  | { kind: "add"; text: string }
  | { kind: "del"; text: string }
  | { kind: "ok"; text: string };

export type ToolStep = {
  at: number;
  tool: "Read" | "Write" | "Edit" | "Bash";
  arg: string;
  results: readonly ResultLine[];
};

export const TOOL_STEPS: readonly ToolStep[] = [
  {
    at: 1.6,
    tool: "Read",
    arg: "CLAUDE.md",
    results: [{ kind: "note", text: "3 focus areas · 3 rules" }],
  },
  {
    at: 2.0,
    tool: "Write",
    arg: "app/site-header.tsx",
    results: [{ kind: "add", text: "<nav>/work /skills /blog /contact</nav>" }],
  },
  {
    at: 2.4,
    tool: "Write",
    arg: "app/page.tsx",
    results: [
      { kind: "add", text: "<h1>Syed Safdar Ali Shah</h1>" },
      { kind: "add", text: "<p>Practical AI, built to ship.</p>" },
    ],
  },
  {
    at: 2.85,
    tool: "Write",
    arg: "app/work.tsx",
    results: [
      {
        kind: "note",
        text: `${projects.length + systems.length} projects · ${projects.length} sites, ${systems.length} systems`,
      },
    ],
  },
  {
    at: 3.45,
    tool: "Write",
    arg: "app/blog/page.tsx",
    results: [{ kind: "note", text: "3 articles · Secure by Design" }],
  },
  {
    at: 3.8,
    tool: "Write",
    arg: "app/contact.tsx",
    results: [{ kind: "add", text: "mailto:programmersafdar@live.com" }],
  },
  {
    at: 4.2,
    tool: "Edit",
    arg: "app/globals.css",
    results: [
      { kind: "del", text: "--accent: #3b82f6;" },
      { kind: "add", text: "--accent: #d97757;" },
      { kind: "del", text: "border: 1px solid #eee;" },
      { kind: "add", text: "border: 3px solid var(--bone);" },
    ],
  },
  {
    at: 5.55,
    tool: "Bash",
    arg: "npm run build",
    results: [
      { kind: "ok", text: "Compiled successfully" },
      { kind: "ok", text: "Lint passed" },
    ],
  },
];

/** Gap between a tool call and each of its result lines. */
export const RESULT_GAP = 0.12;

export type BlockId =
  "header" | "hero" | "card1" | "card2" | "card3" | "card4" | "writing" | "contact" | "footer";

export type Block = {
  id: BlockId;
  label: string;
  /** x, y, width, height in % of the preview viewport. */
  rect: readonly [number, number, number, number];
  /** When the sprite drops it (wireframe). */
  at: number;
};

export const BLOCKS: readonly Block[] = [
  { id: "header", label: "<SiteHeader/>", rect: [3, 3, 94, 8], at: 2.1 },
  { id: "hero", label: "<Hero/>", rect: [3, 14, 94, 30], at: 2.5 },
  { id: "card1", label: "<Project/>", rect: [3, 47, 22, 21], at: 2.95 },
  { id: "card2", label: "<Project/>", rect: [27, 47, 22, 21], at: 3.07 },
  { id: "card3", label: "<Project/>", rect: [51, 47, 22, 21], at: 3.19 },
  { id: "card4", label: "<Project/>", rect: [75, 47, 22, 21], at: 3.31 },
  { id: "writing", label: "<Writing/>", rect: [3, 71, 58, 14], at: 3.55 },
  { id: "contact", label: "<Contact/>", rect: [64, 71, 33, 14], at: 3.9 },
  { id: "footer", label: "<Footer/>", rect: [3, 88, 94, 8], at: 4.02 },
];

/** Blocks turn from wireframe to styled as the sweep line passes them. */
export function styledAt(block: Block) {
  return T.styleStart + (block.rect[1] / 100) * T.styleSweep;
}

const round = (n: number) => Math.round(n * 1000) / 1000;
const s = (n: number) => `${round(n)}s`;
export { s as seconds };

const pct = (t: number) => `${Math.max(0, Math.min(100, (t / T.end) * 100)).toFixed(3)}%`;

/**
 * Sprite flight path: hold, then dart to each block just before it lands.
 * Positions are the sprite's bottom-centre in % of the preview viewport.
 */
export function spritePathKeyframes(name: string) {
  type Stop = { t: number; x: number; y: number; glide?: boolean };
  const stops: Stop[] = [
    { t: 0, x: 50, y: 118 },
    { t: T.spriteIn, x: 50, y: 118 },
    { t: T.spriteIn + 0.2, x: 50, y: 62 },
  ];
  for (const b of BLOCKS) {
    const [x, y, w] = b.rect;
    stops.push({ t: b.at - 0.03, x: x + w / 2, y: y + 1.5 });
  }
  // Ride the style sweep down the left edge.
  stops.push({ t: T.styleStart, x: 9, y: 4 });
  stops.push({ t: T.styleStart + T.styleSweep, x: 9, y: 99, glide: true });
  // Wait for the build in the middle, then hop when it is done.
  stops.push({ t: T.permissionIn, x: 50, y: 66 });
  stops.push({ t: T.done, x: 50, y: 66 });
  stops.push({ t: T.done + 0.12, x: 50, y: 56 });
  stops.push({ t: T.done + 0.24, x: 50, y: 66 });
  stops.push({ t: T.end, x: 50, y: 66 });

  const MOVE = 0.13;
  // Transforms, not left/top, so the flight never counts as a layout shift.
  // The viewport is a 16:10 inline-size container: 1% of its height = 0.625cqw.
  const at = (x: number, y: number) =>
    `transform:translate(calc(${x}cqw - 50%),calc(${round(y * 0.625)}cqw - 100%))`;
  const frames: string[] = [];
  stops.forEach((stop, i) => {
    const prev = stops[i - 1];
    if (prev && !stop.glide && stop.t - MOVE > prev.t) {
      // Hold at the previous point until the dart begins.
      frames.push(
        `${pct(stop.t - MOVE)}{${at(prev.x, prev.y)};animation-timing-function:cubic-bezier(.3,.9,.35,1.15)}`,
      );
    }
    frames.push(`${pct(stop.t)}{${at(stop.x, stop.y)};animation-timing-function:linear}`);
  });
  return `@keyframes ${name}{${frames.join("")}}`;
}

/* ---------------- Terminal transcript ---------------- */

/**
 * Every terminal row has a fixed height in em (rows never wrap), so the
 * transcript is laid out once and scrolled with a transform. Nothing in the
 * overlay changes layout while it plays, which keeps CLS at zero.
 */
export const ROW_EM = {
  banner: 5.2,
  prompt: 3.3,
  tool: 1.95,
  line: 1.6,
  permission: 9.9,
  done: 2.2,
} as const;

/** Vertical padding of the transcript (top + bottom), in em. */
export const TRANSCRIPT_PAD_EM = 1.8;

export type TermRow =
  | { kind: "banner"; at: number }
  | { kind: "prompt"; at: number }
  | { kind: "tool"; at: number; tool: ToolStep["tool"]; arg: string }
  | { kind: "result"; at: number; line: ResultLine }
  | { kind: "permission"; at: number }
  | { kind: "done"; at: number };

export function rowHeight(row: TermRow): number {
  switch (row.kind) {
    case "banner":
      return ROW_EM.banner;
    case "prompt":
      return ROW_EM.prompt;
    case "tool":
      return ROW_EM.tool;
    case "result":
      return ROW_EM.line;
    case "permission":
      return ROW_EM.permission;
    case "done":
      return ROW_EM.done;
  }
}

export const TERM_ROWS: readonly TermRow[] = [
  { kind: "banner", at: T.banner },
  { kind: "prompt", at: T.promptStart },
  ...TOOL_STEPS.flatMap((step): TermRow[] => [
    ...(step.tool === "Bash" ? [{ kind: "permission", at: T.permissionIn } as const] : []),
    { kind: "tool", at: step.at, tool: step.tool, arg: step.arg },
    ...step.results.map((line, i): TermRow => ({ kind: "result", at: step.at + RESULT_GAP * (i + 1), line })),
  ]),
  { kind: "done", at: T.done },
];

/**
 * Scroll keyframes for the transcript: whenever a row appears, slide up just
 * enough to keep the newest row at the bottom of the terminal (100cqh is the
 * terminal body height; it is a size container).
 */
export function transcriptScrollKeyframes(name: string) {
  const offset = (bottomEm: number) =>
    `transform:translateY(min(0px,calc(100cqh - ${round(bottomEm + TRANSCRIPT_PAD_EM)}em)))`;
  const SLIDE = 0.08;
  const frames = [`0%{${offset(0)}}`];
  let bottom = 0;
  for (const row of TERM_ROWS) {
    frames.push(`${pct(row.at)}{${offset(bottom)}}`);
    bottom += rowHeight(row);
    frames.push(`${pct(row.at + SLIDE)}{${offset(bottom)}}`);
  }
  frames.push(`100%{${offset(bottom)}}`);
  return `@keyframes ${name}{${frames.join("")}}`;
}
