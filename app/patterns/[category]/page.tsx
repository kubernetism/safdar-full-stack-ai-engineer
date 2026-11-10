import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import article from "../../blog/article.module.css";
import { Arrow, Cursor, Dot } from "../../components/glyphs";
import { SectionHead } from "../../components/section-head";
import { SiteFrame } from "../../components/site-frame";
import { categories, categoryBySlug, pad2 } from "../content";
import { PatternEntry } from "../pattern-entry";
import styles from "../patterns.module.css";

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/patterns/[category]">): Promise<Metadata> {
  const { category: slug } = await params;
  const category = categoryBySlug(slug);
  if (!category) return {};
  return {
    title: `${category.name} | Patterns | Syed Safdar Ali Shah`,
    description: category.blurb,
  };
}

/*
 * Every category is prerendered from generateStaticParams, so navigations to
 * them are static and prefetched; params are read at the top level, so this
 * segment opts out of instant-navigation validation. An unknown slug renders
 * the not-found UI with noindex (from the partial-prerender shell, so the
 * status is 200; a real 404 would need a check in proxy.ts).
 */
export const instant = false;

export default async function CategoryPage({ params }: PageProps<"/patterns/[category]">) {
  const { category: slug } = await params;
  const category = categoryBySlug(slug);
  if (!category) notFound();

  const index = categories.indexOf(category);
  const number = pad2(index + 1);
  const prev = categories[index - 1];
  const next = categories[index + 1];

  return (
    <SiteFrame current="patterns">
      <header className={article.header}>
        <div className="shell">
          <nav className={article.crumbs} aria-label="Breadcrumb">
            <Link className={article.back} href="/patterns">
              <Arrow direction="left" size="0.95em" />
              cd ../patterns
            </Link>
            <span className={article.path} aria-hidden="true">
              ~/patterns/{category.slug}.md
            </span>
          </nav>
          <p className={article.kicker}>
            <span className={article.partBadge}>
              {number}/{pad2(categories.length)}
            </span>
            Pattern library
          </p>
          <h1 className={article.title}>{category.name}</h1>
          <div className={article.headFoot}>
            <p className={article.dek}>{category.intro}</p>
            <p className={article.stats}>
              <Dot />
              <span>
                {category.patterns.length} patterns · {category.reading.length} sources
              </span>
            </p>
          </div>
        </div>
      </header>

      <div className={`shell ${styles.layout}`}>
        <aside className={styles.palette} aria-label="Pattern index">
          <div className={styles.paletteInput} aria-hidden="true">
            <span className={styles.accent}>/</span>
            {category.slug}
            <Cursor />
          </div>
          <nav aria-label={`${category.name} patterns`}>
            <ol className={styles.paletteList} role="list">
              {category.patterns.map((p, i) => (
                <li key={p.slug}>
                  <a href={`#${p.slug}`}>
                    <span className={styles.paletteNum}>{pad2(i + 1)}</span>
                    {p.name}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <CategorySwitcher current={category.slug} className={styles.desktopOnly} />
          <details className={`${styles.paletteDetails} ${styles.mobileOnly}`}>
            <summary>
              All categories <span className={styles.paletteMeta}>({categories.length})</span>
            </summary>
            <CategorySwitcher current={category.slug} />
          </details>
        </aside>

        <div className={styles.entries}>
          <SectionHead index={number} name={category.slug} meta={`${category.patterns.length} patterns`} />
          <h2 className="sr-only">Patterns</h2>
          {category.patterns.map((p, i) => (
            <PatternEntry key={p.slug} pattern={p} number={`${number}.${i + 1}`} />
          ))}

          <section className={styles.reading} aria-labelledby="reading-title">
            <h2 id="reading-title" className={styles.readingTitle}>
              <span className={styles.accent} aria-hidden="true">
                ##{" "}
              </span>
              Further reading
            </h2>
            <ul className={styles.readingList} role="list">
              {category.reading.map((r) => (
                <li key={r.href}>
                  <a className="link" href={r.href} target="_blank" rel="noreferrer">
                    {r.title}
                  </a>
                  <span className={styles.readingSource}>
                    {r.source} · {new URL(r.href).host}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <nav className={article.pager} aria-label="Category navigation">
        {prev ? (
          <Link className={article.pagerLink} href={`/patterns/${prev.slug}`}>
            <span className={article.pagerLabel}>
              <Arrow direction="left" size="0.9em" /> {pad2(index)}
            </span>
            <span className={article.pagerTitle}>{prev.name}</span>
          </Link>
        ) : (
          <Link className={article.pagerLink} href="/patterns">
            <span className={article.pagerLabel}>
              <Arrow direction="left" size="0.9em" /> Library
            </span>
            <span className={article.pagerTitle}>All categories</span>
          </Link>
        )}
        {next ? (
          <Link className={`${article.pagerLink} ${article.pagerNext}`} href={`/patterns/${next.slug}`}>
            <span className={article.pagerLabel}>
              {pad2(index + 2)} <Arrow size="0.9em" />
            </span>
            <span className={article.pagerTitle}>{next.name}</span>
          </Link>
        ) : (
          <Link className={`${article.pagerLink} ${article.pagerNext}`} href="/patterns">
            <span className={article.pagerLabel}>
              Library <Arrow size="0.9em" />
            </span>
            <span className={article.pagerTitle}>All categories</span>
          </Link>
        )}
      </nav>
    </SiteFrame>
  );
}

function CategorySwitcher({ current, className }: { current: string; className?: string }) {
  return (
    <nav className={className} aria-label="Pattern categories">
      <p className={styles.paletteGroup}>categories</p>
      <ol className={styles.paletteList} role="list">
        {categories.map((c, i) => (
          <li key={c.slug}>
            <Link href={`/patterns/${c.slug}`} aria-current={c.slug === current ? "page" : undefined}>
              <span className={styles.paletteNum}>{pad2(i + 1)}</span>
              {c.name}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
