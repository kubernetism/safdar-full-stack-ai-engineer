import type { Diagram as DiagramSpec, DiagramNode } from "./types";
import styles from "./patterns.module.css";

/*
 * Renders a diagram spec as an inline SVG in the site's brutalist style.
 * Every colour comes from CSS tokens (see .d* classes in patterns.module.css),
 * so diagrams follow the light and dark themes.
 */

const CHAR_W = 7.4; // Geist Mono at 12px
const LINE_H = 15;
const PAD_X = 12;
const ARROW = 9;

type Box = { cx: number; cy: number; hw: number; hh: number; node: DiagramNode };

function measure(node: DiagramNode): Box {
  const lines = node.label.split("\n");
  const longest = Math.max(...lines.map((l) => l.length));
  const diamond = node.kind === "decision";
  const w = node.w ?? Math.round(longest * CHAR_W + PAD_X * 2 + (diamond ? 34 : 0));
  const h = node.h ?? lines.length * LINE_H + (diamond ? 30 : 18);
  return { cx: node.x, cy: node.y, hw: w / 2, hh: h / 2, node };
}

/** Where a ray from the box centre towards (tx, ty) leaves the box, plus a gap. */
function exitPoint(b: Box, tx: number, ty: number, gap: number) {
  const dx = tx - b.cx;
  const dy = ty - b.cy;
  if (dx === 0 && dy === 0) return { x: b.cx, y: b.cy };
  let t: number;
  if (b.node.kind === "decision") {
    // Diamond: |x|/hw + |y|/hh = 1
    t = 1 / (Math.abs(dx) / b.hw + Math.abs(dy) / b.hh);
  } else {
    t = Math.min(dx === 0 ? Infinity : b.hw / Math.abs(dx), dy === 0 ? Infinity : b.hh / Math.abs(dy));
  }
  const len = Math.hypot(dx, dy);
  const k = t + gap / len;
  return { x: b.cx + dx * k, y: b.cy + dy * k };
}

function arrowHead(x: number, y: number, fromX: number, fromY: number) {
  const a = Math.atan2(y - fromY, x - fromX);
  const p = (ang: number, r: number) =>
    `${(x + Math.cos(ang) * r).toFixed(1)},${(y + Math.sin(ang) * r).toFixed(1)}`;
  return `${x.toFixed(1)},${y.toFixed(1)} ${p(a + Math.PI - 0.42, ARROW)} ${p(a + Math.PI + 0.42, ARROW)}`;
}

export function Diagram({ spec, id }: { spec: DiagramSpec; id: string }) {
  const width = spec.w ?? 480;
  const boxes = new Map(spec.nodes.map((node) => [node.id, measure(node)]));
  const titleId = `${id}-title`;

  return (
    <svg
      className={styles.diagram}
      viewBox={`0 0 ${width} ${spec.h}`}
      role="img"
      aria-labelledby={titleId}
      preserveAspectRatio="xMidYMid meet"
    >
      <title id={titleId}>{spec.title}</title>

      {spec.groups?.map((g) => (
        <g key={g.label}>
          <rect className={styles.dGroup} x={g.x} y={g.y} width={g.w} height={g.h} />
          <text className={styles.dGroupLabel} x={g.x + 6} y={g.y + 12}>
            {g.label}
          </text>
        </g>
      ))}

      {spec.edges.map((edge, i) => {
        const a = boxes.get(edge.from);
        const b = boxes.get(edge.to);
        if (!a || !b)
          throw new Error(`Diagram "${spec.title}": unknown node in edge ${edge.from} -> ${edge.to}`);
        const mx = (a.cx + b.cx) / 2;
        const my = (a.cy + b.cy) / 2;
        const len = Math.hypot(b.cx - a.cx, b.cy - a.cy) || 1;
        const bend = edge.curve ?? 0;
        // Control point: perpendicular offset from the midpoint.
        const cx = mx + ((a.cy - b.cy) / len) * bend * -1;
        const cy = my + ((b.cx - a.cx) / len) * bend * -1;
        const start = exitPoint(a, bend ? cx : b.cx, bend ? cy : b.cy, edge.both ? ARROW : 2);
        const end = exitPoint(b, bend ? cx : a.cx, bend ? cy : a.cy, ARROW);
        const d = bend
          ? `M${start.x.toFixed(1)} ${start.y.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${end.x.toFixed(1)} ${end.y.toFixed(1)}`
          : `M${start.x.toFixed(1)} ${start.y.toFixed(1)} L${end.x.toFixed(1)} ${end.y.toFixed(1)}`;
        const tipFrom = bend ? { x: cx, y: cy } : start;
        const tailFrom = bend ? { x: cx, y: cy } : end;
        // Label sits on the curve's midpoint (t = 0.5).
        const lx = bend ? 0.25 * start.x + 0.5 * cx + 0.25 * end.x : (start.x + end.x) / 2;
        const ly = bend ? 0.25 * start.y + 0.5 * cy + 0.25 * end.y : (start.y + end.y) / 2;
        const tipX = end.x + Math.cos(Math.atan2(end.y - tipFrom.y, end.x - tipFrom.x)) * ARROW;
        const tipY = end.y + Math.sin(Math.atan2(end.y - tipFrom.y, end.x - tipFrom.x)) * ARROW;
        const tailX = start.x + Math.cos(Math.atan2(start.y - tailFrom.y, start.x - tailFrom.x)) * ARROW;
        const tailY = start.y + Math.sin(Math.atan2(start.y - tailFrom.y, start.x - tailFrom.x)) * ARROW;
        return (
          <g key={`${edge.from}-${edge.to}-${i}`}>
            <path className={edge.dashed ? `${styles.dEdge} ${styles.dDashed}` : styles.dEdge} d={d} />
            <polygon className={styles.dArrow} points={arrowHead(tipX, tipY, end.x, end.y)} />
            {edge.both ? (
              <polygon className={styles.dArrow} points={arrowHead(tailX, tailY, start.x, start.y)} />
            ) : null}
            {edge.label ? (
              <g data-edge-label="">
                <rect
                  className={styles.dLabelBg}
                  x={lx - (edge.label.length * 6.4) / 2 - 4}
                  y={ly - 8}
                  width={edge.label.length * 6.4 + 8}
                  height={16}
                />
                <text className={styles.dEdgeLabel} x={lx} y={ly}>
                  {edge.label}
                </text>
              </g>
            ) : null}
          </g>
        );
      })}

      {[...boxes.values()].map((b) => (
        <NodeShape key={b.node.id} box={b} />
      ))}
    </svg>
  );
}

function NodeShape({ box }: { box: Box }) {
  const { cx, cy, hw, hh, node } = box;
  const kind = node.kind ?? "box";
  const lines = node.label.split("\n");
  const x = cx - hw;
  const y = cy - hh;
  const textClass =
    kind === "accent"
      ? `${styles.dText} ${styles.dTextOnAccent}`
      : kind === "ghost"
        ? `${styles.dText} ${styles.dTextDim}`
        : styles.dText;

  let shape;
  switch (kind) {
    case "decision":
      shape = (
        <polygon
          className={styles.dDecision}
          points={`${cx},${cy - hh} ${cx + hw},${cy} ${cx},${cy + hh} ${cx - hw},${cy}`}
        />
      );
      break;
    case "store":
      shape = (
        <g>
          <rect className={styles.dBox} x={x} y={y} width={hw * 2} height={hh * 2} />
          <line className={styles.dStoreLine} x1={x} x2={x + hw * 2} y1={y + 6} y2={y + 6} />
        </g>
      );
      break;
    case "user":
      shape = <rect className={styles.dBox} x={x} y={y} width={hw * 2} height={hh * 2} rx={hh} />;
      break;
    case "ghost":
      shape = <rect className={styles.dGhost} x={x} y={y} width={hw * 2} height={hh * 2} />;
      break;
    case "accent":
      shape = (
        <g>
          <rect className={styles.dShadow} x={x + 4} y={y + 4} width={hw * 2} height={hh * 2} />
          <rect className={styles.dAccent} x={x} y={y} width={hw * 2} height={hh * 2} />
        </g>
      );
      break;
    default:
      shape = <rect className={styles.dBox} x={x} y={y} width={hw * 2} height={hh * 2} />;
  }

  const offset = kind === "store" ? 3 : 0;
  return (
    <g data-node={node.id}>
      {shape}
      <text className={textClass} x={cx} y={cy + offset - ((lines.length - 1) * LINE_H) / 2}>
        {lines.map((line, i) => (
          <tspan key={i} x={cx} dy={i === 0 ? 0 : LINE_H}>
            {line}
          </tspan>
        ))}
      </text>
    </g>
  );
}
