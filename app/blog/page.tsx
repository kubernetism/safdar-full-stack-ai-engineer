import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "../site-footer";
import { SiteHeader } from "../site-header";
import shared from "../page.module.css";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Blog | Syed Safdar Ali Shah",
  description: "Writing on AI agents, backend systems, and cloud-native development.",
};

const posts = [
  { href: "/blog/secure-by-design", image: "/images/secure-by-design-cover.png", title: "Secure by design: building security in", description: "A practical introduction to safer software, in 100 short points." },
  { href: "/blog/secure-by-default", image: "/images/secure-by-default-cover.png", title: "Secure by default: the safer starting point", description: "How secure settings protect customers from the start." },
  { href: "/blog/customer-security-ownership", image: "/images/customer-security-ownership-cover.png", title: "Who owns customer security?", description: "Why software makers should take responsibility for customer security outcomes." },
];

export default function BlogPage() {
  return (
    <div className={shared.page}>
      <a className={shared.skipLink} href="#main-content">Skip to content</a>
      <SiteHeader current="blog" />
      <main id="main-content" className={styles.main}>
        <section className={styles.intro} aria-labelledby="blog-title">
          <p className={styles.eyebrow}>The blog</p>
          <h1 id="blog-title">Ideas worth sharing.</h1>
          <p>Notes on software security, AI agents, backend systems, and building for the cloud.</p>
        </section>
        <section className={styles.articles} aria-labelledby="articles-title">
          <div className={styles.sectionHeader}>
            <h2 id="articles-title">Articles</h2>
          </div>
          {posts.map((post, index) => <article className={styles.post} key={post.href}>
            <Link className={styles.postImage} href={post.href} tabIndex={-1} aria-hidden="true">
              <Image src={post.image} alt="" width={1672} height={941} sizes="(max-width: 767px) 100vw, 45vw" />
            </Link>
            <div className={styles.postContent}>
              <p className={styles.postMeta}>Secure by design · Part {index + 1} of 10</p>
              <h3><Link href={post.href}>{post.title}</Link></h3>
              <p>{post.description}</p>
              <Link className={styles.readLink} href={post.href} aria-label={`Read ${post.title}`}>Read article <span aria-hidden="true">↗</span></Link>
            </div>
          </article>)}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
