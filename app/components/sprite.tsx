import styles from "./sprite.module.css";

/**
 * The site's mascot: an original pixel "build sprite" with a visor, a spark
 * antenna, stubby arms and two legs. Drawn from a character map so every
 * pixel is a crisp rect. Not affiliated with any official mark.
 *
 *   s spark   a antenna   o body   d body shade   v visor   e eye
 *   L/R arms  l/r legs
 */
const MAP = [
  "......s......",
  ".....sss.....",
  "......s......",
  "......a......",
  "...ooooooo...",
  "..ooooooooo..",
  "..ovvvvvvvo..",
  "..ovevvvevo..",
  "..ovvvvvvvo..",
  "..ooooooooo..",
  "LLoooooooooRR",
  "...ddddddd...",
  "...ll...rr...",
  "...ll...rr...",
] as const;

const WIDTH = MAP[0].length;
const HEIGHT = MAP.length;

type Part = "spark" | "antenna" | "body" | "shade" | "visor" | "eye" | "armL" | "armR" | "legL" | "legR";

const PART: Record<string, Part> = {
  s: "spark",
  a: "antenna",
  o: "body",
  d: "shade",
  v: "visor",
  e: "eye",
  L: "armL",
  R: "armR",
  l: "legL",
  r: "legR",
};

/** Merge horizontal runs of the same part into single rects. */
function rectsFor(part: Part) {
  const rects: { x: number; y: number; w: number }[] = [];
  MAP.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      if (PART[row[x]] === part) {
        let w = 1;
        while (PART[row[x + w]] === part) w += 1;
        rects.push({ x, y, w });
        x += w;
      } else {
        x += 1;
      }
    }
  });
  return rects;
}

function Pixels({ part, className }: { part: Part; className?: string }) {
  return (
    <g className={className}>
      {rectsFor(part).map(({ x, y, w }) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={w} height={1} />
      ))}
    </g>
  );
}

export type SpriteMode = "idle" | "typing" | "walking" | "still";

export function Sprite({
  size = 64,
  mode = "idle",
  className,
  title,
}: {
  size?: number | string;
  mode?: SpriteMode;
  className?: string;
  /** Pass a title only where the sprite carries meaning; otherwise it is decorative. */
  title?: string;
}) {
  const height = typeof size === "number" ? (size * HEIGHT) / WIDTH : undefined;
  return (
    <svg
      className={[styles.sprite, className].filter(Boolean).join(" ")}
      data-mode={mode}
      width={size}
      height={height}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      shapeRendering="crispEdges"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <g className={styles.figure}>
        <Pixels part="spark" className={styles.spark} />
        <Pixels part="antenna" className={styles.antenna} />
        <Pixels part="armL" className={styles.armL} />
        <Pixels part="armR" className={styles.armR} />
        <Pixels part="body" className={styles.body} />
        <Pixels part="shade" className={styles.shade} />
        <Pixels part="visor" className={styles.visor} />
        <Pixels part="eye" className={styles.eye} />
      </g>
      <Pixels part="legL" className={styles.legL} />
      <Pixels part="legR" className={styles.legR} />
    </svg>
  );
}
