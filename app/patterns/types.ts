/**
 * Typed model for the patterns library. Each category lives in its own file
 * under ./data and is registered in ./content.ts.
 */

export type NodeKind =
  | "box" // a component or step
  | "accent" // the model / the star of the diagram
  | "store" // a database, index or cache
  | "ghost" // optional or external
  | "decision" // a gate, router or classifier
  | "user"; // a person or client

export type DiagramNode = {
  id: string;
  /** Use "\n" for a second line. */
  label: string;
  /** Centre of the node in SVG units (the canvas is 480 wide by default). */
  x: number;
  y: number;
  w?: number;
  h?: number;
  kind?: NodeKind;
};

export type DiagramEdge = {
  from: string;
  to: string;
  label?: string;
  dashed?: boolean;
  /** Bend the edge sideways by this many units (positive = to the left of travel). */
  curve?: number;
  /** Draw arrowheads at both ends. */
  both?: boolean;
};

export type DiagramGroup = {
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

export type Diagram = {
  /** Accessible name, read by screen readers as the image's title. */
  title: string;
  w?: number;
  h: number;
  nodes: readonly DiagramNode[];
  edges: readonly DiagramEdge[];
  groups?: readonly DiagramGroup[];
};

export type CodeLang = "python" | "ts" | "yaml" | "bash" | "sql" | "text" | "dockerfile" | "markdown";

export type Pattern = {
  slug: string;
  name: string;
  /** One line, used in search results and category cards. */
  summary: string;
  definition: string;
  useWhen: readonly string[];
  pros: readonly string[];
  cons: readonly string[];
  example: string;
  code?: { lang: CodeLang; file: string; source: string };
  diagram: Diagram;
};

export type Reading = { title: string; source: string; href: string };

export type Category = {
  slug: string;
  name: string;
  /** One line for cards. */
  blurb: string;
  /** A short paragraph at the top of the category page. */
  intro: string;
  patterns: readonly Pattern[];
  reading: readonly Reading[];
};
