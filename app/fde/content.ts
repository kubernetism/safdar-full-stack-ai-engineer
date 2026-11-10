import { categoryBySlug } from "../patterns/content";
import { aiDetails } from "./data/details-ai";
import { customerDetails } from "./data/details-customer";
import { softwareDetails } from "./data/details-software";
import { items, itemBySlug, PHASES, SECTIONS, SOURCE, TIERS } from "./data/items";
import type { FdeDetail, FdeItem, PatternRef, SectionId, Tier } from "./types";

export { items, itemBySlug, PHASES, SECTIONS, SOURCE, TIERS };

const details: Partial<Record<string, FdeDetail>> = { ...softwareDetails, ...aiDetails, ...customerDetails };

export function detailFor(slug: string): FdeDetail | undefined {
  return details[slug];
}

export const detailedCount = items.filter((i) => details[i.slug]).length;

export const SECTION_ORDER: readonly SectionId[] = ["software", "ai", "customer"];
export const TIER_ORDER: readonly Tier[] = ["high", "medium", "nice"];

export function itemsIn(section: SectionId, tier?: Tier): FdeItem[] {
  return items.filter((i) => i.section === section && (!tier || i.tier === tier));
}

export function patternFor(ref: PatternRef) {
  const category = categoryBySlug(ref.category);
  const pattern = category?.patterns.find((p) => p.slug === ref.slug);
  return category && pattern ? { category, pattern } : undefined;
}

/*
 * Fail the build if any cross-link is broken: unknown related items, unknown
 * /patterns entries, or details for a slug that does not exist.
 */
for (const [slug, detail] of Object.entries(details)) {
  if (!detail) continue;
  if (!itemBySlug(slug)) throw new Error(`FDE details for unknown item "${slug}"`);
  for (const next of detail.next) {
    if (!itemBySlug(next)) throw new Error(`FDE "${slug}": unknown related item "${next}"`);
  }
  for (const ref of detail.patterns ?? []) {
    if (!patternFor(ref)) throw new Error(`FDE "${slug}": unknown pattern ${ref.category}#${ref.slug}`);
  }
}
