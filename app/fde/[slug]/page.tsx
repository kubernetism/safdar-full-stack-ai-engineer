import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import article from "../../blog/article.module.css";
import patterns from "../../patterns/patterns.module.css";
import { Arrow, Cursor, Dot, Elbow, TodoBox } from "../../components/glyphs";
import { SiteFrame } from "../../components/site-frame";
import { detailFor, items, itemBySlug, patternFor, PHASES, SECTIONS, SOURCE, TIERS } from "../content";
import { PctChip, TierBadge } from "../pct-chip";
import styles from "../fde.module.css";
import type { FdeDetail, FdeItem } from "../types";

export function generateStaticParams() {
  return items.map((i) => ({ slug: i.slug }));
}

/* Every item is prerendered; params are read at the top level, so this segment opts out of instant validation. */
export const instant = false;

export async function generateMetadata({ params }: PageProps<"/fde/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const item = itemBySlug(slug);
  if (!item) return {};
  return { title: `${item.title} | FDE Roadmap | Syed Safdar Ali Shah`, description: item.definition };
}

const SECTIONS_ON_PAGE = [
  ["definition", "Definition"],
  ["summary", "Summary"],
  ["why", "Why it matters for an FDE"],
  ["roadmap", "Roadmap"],
  ["guidelines", "Guidelines"],
  ["pitfalls", "Common pitfalls"],
  ["practice", "Hands-on practice"],
  ["next", "What to study next"],
  ["books", "Recommended books"],
  ["interview", "Interview angle"],
] as const;

export default async function FdeItemPage({ params }: PageProps<"/fde/[slug]">) {
  const { slug } = await params;
  const item = itemBySlug(slug);
  if (!item) notFound();

  const index = items.indexOf(item);
  const prev = items[index - 1];
  const next = items[index + 1];
  const detail = detailFor(slug);
  const phaseItems = items.filter((i) => i.phase === item.phase);

  return (
    <SiteFrame current="fde">
      <header className={article.header}>
        <div className="shell">
          <nav className={article.crumbs} aria-label="Breadcrumb">
            <Link className={article.back} href="/fde">
              <Arrow direction="left" size="0.95em" />
              cd ../fde
            </Link>
            <span className={article.path} aria-hidden="true">
              ~/fde/{item.slug}.md
            </span>
          </nav>
          <p className={`${article.kicker} ${styles.itemKicker}`}>
            <span className={article.partBadge}>
              {String(index + 1).padStart(2, "0")}/{items.length}
            </span>
            {SECTIONS[item.section].name}
            <TierBadge tier={item.tier} />
            <PctChip pct={item.pct} large />
          </p>
          <h1 className={`${article.title} ${styles.itemTitle}`}>{item.title}</h1>
          <div className={article.headFoot}>
            <p className={article.dek}>{item.definition}</p>
            <p className={article.stats}>
              <Dot />
              <span>
                Phase {item.phase} · {PHASES[item.phase].name}
              </span>
            </p>
          </div>
        </div>
      </header>

      <div className={`shell ${patterns.layout}`}>
        <aside className={patterns.palette} aria-label="On this page">
          <div className={patterns.paletteInput} aria-hidden="true">
            <span className={patterns.accent}>/</span>
            {item.slug.length > 18 ? `${item.slug.slice(0, 18)}…` : item.slug}
            <Cursor />
          </div>
          <nav aria-label="Sections">
            <ol className={patterns.paletteList} role="list">
              {SECTIONS_ON_PAGE.map(([id, label], i) => (
                <li key={id}>
                  <a href={`#${id}`}>
                    <span className={patterns.paletteNum}>{String(i + 1).padStart(2, "0")}</span>
                    {label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <nav className={patterns.desktopOnly} aria-label={`Phase ${item.phase} skills`}>
            <p className={patterns.paletteGroup}>
              phase {item.phase}: {PHASES[item.phase].name}
            </p>
            <ol className={`${patterns.paletteList} ${styles.phaseList}`} role="list">
              {phaseItems.map((p) => (
                <li key={p.slug}>
                  <Link href={`/fde/${p.slug}`} aria-current={p.slug === item.slug ? "page" : undefined}>
                    <span className={patterns.paletteNum}>{p.pct.replace("<=", "")}</span>
                    {shortTitle(p.title)}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <div className={styles.itemBody}>
          <section id="definition" className={`tool ${styles.card}`} aria-labelledby="definition-title">
            <div className="tool__head">
              <Dot />
              <h2 id="definition-title" className={styles.cardTitle}>
                Definition
              </h2>
            </div>
            <div className={styles.cardBody}>
              <p className={styles.dictTerm}>
                {shortTitle(item.title)}
                <span className={styles.dictPos}>
                  skill · {SECTIONS[item.section].name.toLowerCase()} · {TIERS[item.tier].toLowerCase()}
                </span>
              </p>
              <p className={styles.dictDef}>{item.definition}</p>
              <p className={styles.provenance}>
                <Elbow />
                <span>
                  Posting share: <strong>{item.pct}</strong>
                  {item.pct.includes("*") ? " (asterisk: employers assume it)" : ""}. Source: {SOURCE.credit},{" "}
                  {SOURCE.basis}.
                </span>
              </p>
            </div>
          </section>

          {detail ? <Details item={item} detail={detail} /> : <Pending />}
        </div>
      </div>

      <nav className={article.pager} aria-label="Skill navigation">
        {prev ? (
          <Link className={article.pagerLink} href={`/fde/${prev.slug}`}>
            <span className={article.pagerLabel}>
              <Arrow direction="left" size="0.9em" /> {TIERS[prev.tier]} · {prev.pct}
            </span>
            <span className={article.pagerTitle}>{shortTitle(prev.title)}</span>
          </Link>
        ) : (
          <Link className={article.pagerLink} href="/fde">
            <span className={article.pagerLabel}>
              <Arrow direction="left" size="0.9em" /> Roadmap
            </span>
            <span className={article.pagerTitle}>All 52 skills</span>
          </Link>
        )}
        {next ? (
          <Link className={`${article.pagerLink} ${article.pagerNext}`} href={`/fde/${next.slug}`}>
            <span className={article.pagerLabel}>
              {TIERS[next.tier]} · {next.pct} <Arrow size="0.9em" />
            </span>
            <span className={article.pagerTitle}>{shortTitle(next.title)}</span>
          </Link>
        ) : (
          <Link className={`${article.pagerLink} ${article.pagerNext}`} href="/fde">
            <span className={article.pagerLabel}>
              Roadmap <Arrow size="0.9em" />
            </span>
            <span className={article.pagerTitle}>All 52 skills</span>
          </Link>
        )}
      </nav>
    </SiteFrame>
  );
}

function shortTitle(title: string) {
  const cut = title.indexOf(":");
  return cut > 0 ? title.slice(0, cut) : title;
}

function Pending() {
  return (
    <p className={styles.pending}>
      <Elbow />
      Study notes for this skill are being written.
    </p>
  );
}

function Card({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className={`tool ${styles.card}`} aria-labelledby={`${id}-title`}>
      <div className="tool__head">
        <Dot />
        <h2 id={`${id}-title`} className={styles.cardTitle}>
          {title}
        </h2>
      </div>
      <div className={styles.cardBody}>{children}</div>
    </section>
  );
}

function Details({ item, detail }: { item: FdeItem; detail: FdeDetail }) {
  const levels = [
    ["Beginner", detail.roadmap.beginner],
    ["Intermediate", detail.roadmap.intermediate],
    ["Advanced", detail.roadmap.advanced],
  ] as const;
  return (
    <>
      <Card id="summary" title="Summary">
        <p className={styles.prose}>{detail.summary}</p>
      </Card>

      <Card id="why" title="Why it matters for an FDE">
        <p className={styles.prose}>{detail.why}</p>
      </Card>

      <Card id="roadmap" title="Roadmap">
        <ol className={styles.levels} role="list">
          {levels.map(([level, steps], i) => (
            <li key={level} className={styles.level}>
              <p className={styles.levelName}>
                <span className={styles.levelNum}>L{i + 1}</span> {level}
              </p>
              <ul className={styles.milestones} role="list">
                {steps.map((s) => (
                  <li key={s}>
                    <TodoBox />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Card>

      <Card id="guidelines" title="Guidelines">
        <h3 className={styles.subLabel}>Do</h3>
        <ul className="diff" role="list" aria-label="Do">
          {detail.dos.map((d) => (
            <li key={d} className="diff__line" data-op="add">
              {d}
            </li>
          ))}
        </ul>
        <h3 className={styles.subLabel}>Don&rsquo;t</h3>
        <ul className="diff" role="list" aria-label="Don't">
          {detail.donts.map((d) => (
            <li key={d} className="diff__line" data-op="del">
              {d}
            </li>
          ))}
        </ul>
      </Card>

      <Card id="pitfalls" title="Common pitfalls">
        <ul className={styles.plainList} role="list">
          {detail.pitfalls.map((p) => (
            <li key={p}>
              <Elbow />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card id="practice" title="Hands-on practice">
        <ol className={styles.numbered} role="list">
          {detail.practice.map((p, i) => (
            <li key={p}>
              <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
              <span>{p}</span>
            </li>
          ))}
        </ol>
      </Card>

      <Card id="next" title="What to study next">
        <ul className={styles.related} role="list">
          {detail.next.map((s) => {
            const rel = itemBySlug(s);
            if (!rel) return null;
            return (
              <li key={s}>
                <Link className={styles.relatedLink} href={`/fde/${rel.slug}`}>
                  {shortTitle(rel.title)}
                </Link>
                <PctChip pct={rel.pct} />
              </li>
            );
          })}
        </ul>
        {detail.patterns?.length ? (
          <>
            <h3 className={styles.subLabel}>Related patterns</h3>
            <ul className={styles.related} role="list">
              {detail.patterns.map((ref) => {
                const found = patternFor(ref);
                if (!found) return null;
                return (
                  <li key={`${ref.category}-${ref.slug}`}>
                    <Link className={styles.relatedLink} href={`/patterns/${ref.category}#${ref.slug}`}>
                      {found.pattern.name}
                    </Link>
                    <span className={styles.relatedMeta}>{found.category.name}</span>
                  </li>
                );
              })}
            </ul>
          </>
        ) : null}
      </Card>

      <Card id="books" title="Recommended books">
        <ul className={styles.books} role="list">
          {detail.books.map((b) => (
            <li key={b.title}>
              <cite className={styles.bookTitle}>{b.title}</cite>
              <span className={styles.bookAuthor}>{b.author}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card id="interview" title="Interview angle">
        <ol className={styles.numbered} role="list">
          {detail.interview.map((q, i) => (
            <li key={q}>
              <span className={styles.num}>Q{i + 1}</span>
              <span>{q}</span>
            </li>
          ))}
        </ol>
        <p className={styles.interviewNote}>
          <Elbow />
          <span>
            Answer with a real example: the situation, what you did, and the measurable result for{" "}
            {item.section === "customer" ? "the customer" : "users"}.
          </span>
        </p>
      </Card>
    </>
  );
}
