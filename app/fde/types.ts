/** Typed model for the Forward Deployed Engineer (FDE) roadmap. */

export type SectionId = "software" | "ai" | "customer";
export type Tier = "high" | "medium" | "nice";
export type PhaseId = 1 | 2 | 3 | 4 | 5;

export type FdeItem = {
  slug: string;
  /** The checkbox id used in the source checklist, kept for provenance. */
  sourceId: string;
  title: string;
  section: SectionId;
  tier: Tier;
  /**
   * Share of 100 live FDE postings that mention the skill, exactly as in the
   * source checklist: "87%", "15%*", "*", "<=11%". An asterisk means employers
   * assume you already have it, so postings rarely spell it out.
   */
  pct: string;
  phase: PhaseId;
  /** One or two lines, dictionary style. */
  definition: string;
};

export type Book = { title: string; author: string };

/** A link to an entry in the /patterns library. */
export type PatternRef = { category: string; slug: string };

export type FdeDetail = {
  summary: string;
  why: string;
  roadmap: { beginner: readonly string[]; intermediate: readonly string[]; advanced: readonly string[] };
  dos: readonly string[];
  donts: readonly string[];
  pitfalls: readonly string[];
  practice: readonly string[];
  /** Related checklist item slugs. */
  next: readonly string[];
  patterns?: readonly PatternRef[];
  /** Real books only, title and author, no links. */
  books: readonly Book[];
  interview: readonly string[];
};
