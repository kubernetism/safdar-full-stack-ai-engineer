import type { Metadata } from "next";
import Link from "next/link";
import { Dot, Elbow, TodoBox } from "../components/glyphs";
import { PostRow } from "../components/post-row";
import { SectionHead } from "../components/section-head";
import { SiteFrame } from "../components/site-frame";
import { plannedParts, posts, SERIES } from "../content";
import styles from "./blog.module.css";

export const metadata: Metadata = {
  title: "Blog | Syed Safdar Ali Shah",
  description: "Writing on software security, AI agents, backend systems, and cloud-native development.",
};

export default function BlogPage() {
  return (
    <SiteFrame current="blog">
      <section className={styles.head} aria-labelledby="blog-title">
        <div className="shell">
          <p className={styles.cmd} aria-hidden="true">
            <span className={styles.accent}>&gt;</span> cat ~/blog/series.md
          </p>
          <h1 id="blog-title" className={styles.title}>
            Writing
          </h1>
          <div className={styles.headGrid}>
            <p className={styles.lede}>
              Notes on software security, AI agents, backend systems, and building for the cloud.
            </p>
            <div className={`tool ${styles.seriesCard}`}>
              <div className="tool__head">
                <Dot />
                <span>
                  <span className="tool__name">Read</span>
                  <span className="tool__arg">(series.md)</span>
                </span>
                <span className="tool__status">
                  {posts.length}/{SERIES.parts} published
                </span>
              </div>
              <div className="tool__body">
                <p className={styles.seriesText}>
                  <strong>{SERIES.name}</strong> is a {SERIES.parts}-part series based on the joint CISA, NSA,
                  FBI and international partners&rsquo;{" "}
                  <a className="link" href={SERIES.sourceUrl} target="_blank" rel="noreferrer">
                    {SERIES.sourceTitle}
                  </a>
                  . Each article summarises one theme in 100 short points.
                </p>
                <div
                  className={styles.progress}
                  role="img"
                  aria-label={`${posts.length} of ${SERIES.parts} parts published`}
                >
                  {Array.from({ length: SERIES.parts }, (_, i) => (
                    <span key={i} data-done={i < posts.length ? "" : undefined} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.block} aria-labelledby="published-title">
        <div className="shell">
          <SectionHead index="01" name="published" meta={`${posts.length} articles`} />
          <h2 id="published-title" className={styles.subTitle}>
            Published
          </h2>
        </div>
        <ol className={styles.posts} role="list">
          {posts.map((post) => (
            <li key={post.slug}>
              <PostRow post={post} />
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.block} aria-labelledby="queue-title">
        <div className="shell">
          <SectionHead index="02" name="queue" meta={`${plannedParts.length} planned`} />
          <h2 id="queue-title" className={styles.subTitle}>
            Up next in the series
          </h2>
          <div className={`tool ${styles.queue}`}>
            <div className="tool__head">
              <Dot tone="accent" />
              <span className="tool__name">Update Todos</span>
            </div>
            <ol className={styles.todo} role="list">
              {posts.map((post) => (
                <li key={post.slug} className={styles.todoDone}>
                  <TodoBox checked />
                  <span className={styles.todoPart}>{String(post.part).padStart(2, "0")}</span>
                  <span className={styles.todoCopy}>
                    <Link className="link" href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                    <span className={styles.todoNote}>published</span>
                  </span>
                </li>
              ))}
              {plannedParts.map((part) => (
                <li key={part.part}>
                  <TodoBox />
                  <span className={styles.todoPart}>{String(part.part).padStart(2, "0")}</span>
                  <span className={styles.todoCopy}>
                    <strong>{part.title}</strong>
                    <span className={styles.todoNote}>
                      <Elbow />
                      {part.text}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </SiteFrame>
  );
}
