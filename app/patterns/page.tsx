import type { Metadata } from "next";
import Link from "next/link";
import home from "../home.module.css";
import { Dot } from "../components/glyphs";
import { SectionHead } from "../components/section-head";
import { SiteFrame } from "../components/site-frame";
import { categories, pad2, patternCount, searchIndex } from "./content";
import { PaletteSearch } from "../components/palette-search";
import styles from "./patterns.module.css";

export const metadata: Metadata = {
  title: "Patterns | Syed Safdar Ali Shah",
  description:
    "A design-patterns library for AI agents, RAG, the OpenAI Agents SDK, system design, LLMOps, software, data engineering and DevOps, with diagrams and examples.",
};

export default function PatternsPage() {
  return (
    <SiteFrame current="patterns">
      <section className={styles.head} aria-labelledby="patterns-title">
        <div className="shell">
          <p className={styles.cmd} aria-hidden="true">
            <span className={styles.accent}>&gt;</span> ls ~/patterns
          </p>
          <h1 id="patterns-title" className={styles.title}>
            Patterns
          </h1>
          <div className={styles.headGrid}>
            <p className={home.lede}>
              A field guide to the designs I build with: agents, retrieval, system design, operations and the
              classics. Each pattern has a definition, when to use it, its trade-offs, an example and a
              diagram.
            </p>
            <p className={styles.headStats}>
              <Dot />
              <span>
                {patternCount} patterns · {categories.length} categories
              </span>
            </p>
          </div>
        </div>
      </section>

      <PaletteSearch
        entries={searchIndex.map((e) => ({
          key: `${e.category}-${e.slug}`,
          href: `/patterns/${e.category}#${e.slug}`,
          kicker: `${pad2(e.index)} /${e.category}`,
          name: e.name,
          summary: e.summary,
          keywords: e.categoryName,
        }))}
        placeholder="search patterns: rag, cache, handoff…"
        noun="patterns"
        label="Search patterns"
      >
        <section className={styles.catalog} aria-labelledby="catalog-title">
          <div className="shell">
            <SectionHead index="00" name="categories" meta={`${categories.length} files`} />
            <h2 id="catalog-title" className="sr-only">
              Categories
            </h2>
            <ol className={styles.cards} role="list">
              {categories.map((c, i) => (
                <li key={c.slug}>
                  <article className={`tool ${styles.card}`} aria-labelledby={`cat-${c.slug}`}>
                    <div className="tool__head">
                      <Dot />
                      <span>
                        <span className="tool__name">Read</span>
                        <span className="tool__arg">({c.slug}.md)</span>
                      </span>
                      <span className="tool__status">{c.patterns.length} patterns</span>
                    </div>
                    <div className={styles.cardBody}>
                      <p className={styles.cardNum} aria-hidden="true">
                        {pad2(i + 1)}
                      </p>
                      <h3 id={`cat-${c.slug}`} className={styles.cardName}>
                        <Link className={styles.cardLink} href={`/patterns/${c.slug}`}>
                          {c.name}
                        </Link>
                      </h3>
                      <p className={styles.cardBlurb}>{c.blurb}</p>
                      <ul className={styles.cardPatterns} role="list" aria-label={`${c.name} patterns`}>
                        {c.patterns.map((p) => (
                          <li key={p.slug}>
                            <Link className="tag" href={`/patterns/${c.slug}#${p.slug}`}>
                              {p.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </PaletteSearch>
    </SiteFrame>
  );
}
