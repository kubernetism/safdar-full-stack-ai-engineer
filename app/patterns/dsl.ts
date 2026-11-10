import type { DiagramEdge, DiagramNode, NodeKind } from "./types";

/** Shorthand for diagram specs: n("llm", "LLM", 240, 80, "accent"). */
export function n(id: string, label: string, x: number, y: number, kind?: NodeKind, w?: number): DiagramNode {
  return { id, label, x, y, kind, w };
}

/** Shorthand for edges: e("a", "b", { label: "yes", dashed: true }). */
export function e(from: string, to: string, opts: Omit<DiagramEdge, "from" | "to"> = {}): DiagramEdge {
  return { from, to, ...opts };
}

/** Python code blocks are written indented in template literals; strip the shared indent. */
export function code(source: string): string {
  const lines = source.replace(/^\n/, "").replace(/\s+$/, "").split("\n");
  const indent = Math.min(...lines.filter((l) => l.trim()).map((l) => l.match(/^ */)![0].length));
  return lines.map((l) => l.slice(indent)).join("\n");
}
