import Image from "next/image";
import Link from "next/link";
import { Arrow, Dot, Elbow } from "../components/glyphs";
import { SiteFrame } from "../components/site-frame";
import { plannedParts, posts, SERIES, type Post } from "../content";
import styles from "./article.module.css";

type SummarySection = { title: string; lines: string[] };

const pad = (n: number, width = 2) => String(n).padStart(width, "0");

export function BlogArticle({ post, sections }: { post: Post; sections: SummarySection[] }) {
  const prev = posts.find((p) => p.part === post.part - 1);
  const next = posts.find((p) => p.part === post.part + 1);
  const upcoming = next ? undefined : plannedParts.find((p) => p.part === post.part + 1);
  const pointCount = sections.reduce((sum, section) => sum + section.lines.length, 0);

  return (
    <SiteFrame current="blog">
      <article className={styles.article} aria-labelledby="article-title">
        <header className={styles.header}>
          <div className="shell">
            <nav className={styles.crumbs} aria-label="Breadcrumb">
              <Link className={styles.back} href="/blog">
                <Arrow direction="left" size="0.95em" />
                cd ../blog
              </Link>
              <span className={styles.path} aria-hidden="true">
                ~/blog/{post.slug}.md
              </span>
            </nav>
            <p className={styles.kicker}>
              <span className={styles.partBadge}>
                Part {pad(post.part)}/{pad(SERIES.parts)}
              </span>
              {SERIES.name}
            </p>
            <h1 id="article-title" className={styles.title}>
              {post.title}
            </h1>
            <div className={styles.headFoot}>
              <p className={styles.dek}>{post.dek}</p>
              <p className={styles.stats}>
                <Dot />
                <span>
                  {pointCount} points · {sections.length} sections
                </span>
              </p>
            </div>
          </div>
        </header>

        <div className="shell">
          <figure className={styles.cover}>
            <Image
              src={post.image}
              alt={post.imageAlt}
              width={1672}
              height={941}
              priority
              sizes="(max-width: 1440px) 100vw, 1360px"
            />
          </figure>
        </div>

        <div className={`shell ${styles.layout}`}>
          <aside className={styles.toc}>
            <nav aria-label="Sections">
              <p className={styles.tocTitle}>Contents</p>
              <ol role="list">
                {sections.map((section, i) => (
                  <li key={section.title}>
                    <a href={`#section-${i + 1}`}>
                      <span className={styles.tocNum}>{pad(i + 1)}</span>
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>

          <div className={styles.body}>
            <p className={styles.source}>
              <Elbow />
              <span>
                Based on the joint CISA, NSA, FBI and international partners&rsquo;{" "}
                <a className="link" href={SERIES.sourceUrl} target="_blank" rel="noreferrer">
                  {SERIES.sourceTitle}
                </a>
                , especially pages {post.sourcePages}. The practical examples are applications of the guide,
                not a promise of complete security.
              </span>
            </p>

            <h2 className={styles.h2}>Summary in 100 points</h2>

            {sections.map((section, sectionIndex) => (
              <section
                key={section.title}
                id={`section-${sectionIndex + 1}`}
                className={styles.section}
                aria-labelledby={`section-${sectionIndex + 1}-title`}
              >
                <h3 id={`section-${sectionIndex + 1}-title`} className={styles.h3}>
                  <span className={styles.h3Num} aria-hidden="true">
                    ## {pad(sectionIndex + 1)}
                  </span>
                  {section.title}
                </h3>
                <ol className={styles.points} role="list">
                  {section.lines.map((line, lineIndex) => (
                    <li key={line}>
                      <span className={styles.pointNum}>{pad(sectionIndex * 10 + lineIndex + 1, 3)}</span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ol>
              </section>
            ))}
          </div>
        </div>

        <nav className={styles.pager} aria-label="Series navigation">
          {prev ? (
            <Link className={styles.pagerLink} href={`/blog/${prev.slug}`}>
              <span className={styles.pagerLabel}>
                <Arrow direction="left" size="0.9em" /> Part {pad(prev.part)}
              </span>
              <span className={styles.pagerTitle}>{prev.title}</span>
            </Link>
          ) : (
            <Link className={styles.pagerLink} href="/blog">
              <span className={styles.pagerLabel}>
                <Arrow direction="left" size="0.9em" /> Series
              </span>
              <span className={styles.pagerTitle}>All articles</span>
            </Link>
          )}
          {next ? (
            <Link className={`${styles.pagerLink} ${styles.pagerNext}`} href={`/blog/${next.slug}`}>
              <span className={styles.pagerLabel}>
                Part {pad(next.part)} <Arrow size="0.9em" />
              </span>
              <span className={styles.pagerTitle}>{next.title}</span>
            </Link>
          ) : upcoming ? (
            <div className={`${styles.pagerLink} ${styles.pagerNext} ${styles.pagerPending}`}>
              <span className={styles.pagerLabel}>Part {pad(upcoming.part)} · planned</span>
              <span className={styles.pagerTitle}>{upcoming.title}</span>
            </div>
          ) : null}
        </nav>
      </article>
    </SiteFrame>
  );
}
