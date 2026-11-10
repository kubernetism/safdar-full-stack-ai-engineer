import Image from "next/image";
import Link from "next/link";
import { SERIES, type Post } from "../content";
import { Arrow } from "./glyphs";
import styles from "./post-row.module.css";

const pad = (n: number) => String(n).padStart(2, "0");

/** One article as a log row: part number, title, description, cover, arrow. */
export function PostRow({ post, headingLevel = "h3" }: { post: Post; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <article className={styles.row}>
      <p className={styles.part}>
        <span className={styles.partNum}>{pad(post.part)}</span>
        <span className={styles.partOf}>/{pad(SERIES.parts)}</span>
      </p>
      <div className={styles.copy}>
        <Heading className={styles.title}>
          <Link className={styles.link} href={`/blog/${post.slug}`}>
            {post.title}
          </Link>
        </Heading>
        <p className={styles.description}>{post.description}</p>
        <p className={styles.meta}>
          {SERIES.name} · Part {post.part} of {SERIES.parts} · 100 points
        </p>
      </div>
      <div className={styles.cover}>
        <Image src={post.image} alt="" width={1672} height={941} sizes="(max-width: 760px) 100vw, 260px" />
      </div>
      <span className={styles.arrow} aria-hidden="true">
        <Arrow size="1.6rem" />
      </span>
    </article>
  );
}
