import { agentic } from "./data/agentic";
import { agenticRag } from "./data/agentic-rag";
import { agenticSystemDesign } from "./data/agentic-system-design";
import { agentsSdk } from "./data/agents-sdk";
import { dataEngineering } from "./data/data-engineering";
import { devops } from "./data/devops";
import { llmops } from "./data/llmops";
import { loopContext } from "./data/loop-context";
import { rag } from "./data/rag";
import { softwareDesign } from "./data/software-design";
import { systemDesign } from "./data/system-design";
import { techStack } from "./data/tech-stack";
import type { Category, Pattern } from "./types";

/** Categories in the order the library presents them. Add a category by adding a file in ./data. */
export const categories: readonly Category[] = [
  agentic,
  rag,
  agenticRag,
  agentsSdk,
  agenticSystemDesign,
  systemDesign,
  loopContext,
  llmops,
  softwareDesign,
  dataEngineering,
  devops,
  techStack,
];

export function categoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export const patternCount = categories.reduce((sum, c) => sum + c.patterns.length, 0);

export type SearchEntry = {
  slug: string;
  name: string;
  summary: string;
  category: string;
  categoryName: string;
  index: number;
};

/** The small index the client-side search filters over. */
export const searchIndex: readonly SearchEntry[] = categories.flatMap((c, i) =>
  c.patterns.map((p: Pattern) => ({
    slug: p.slug,
    name: p.name,
    summary: p.summary,
    category: c.slug,
    categoryName: c.name,
    index: i + 1,
  })),
);

export const pad2 = (n: number) => String(n).padStart(2, "0");
