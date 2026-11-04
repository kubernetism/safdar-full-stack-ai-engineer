import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "../site-footer";
import { SiteHeader } from "../site-header";
import shared from "../page.module.css";
import styles from "./secure-by-design/page.module.css";

type SummarySection = { title: string; lines: string[] };

export function BlogArticle({
  part, title, description, image, imageAlt, sourcePages, sections,
}: {
  part: number;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  sourcePages: string;
  sections: SummarySection[];
}) {
  return (
    <div className={shared.page}>
      <a className={shared.skipLink} href="#main-content">Skip to content</a>
      <SiteHeader current="blog" />
      <main id="main-content" className={styles.main}>
        <Link className={styles.back} href="/blog">← All articles</Link>
        <article>
          <header className={styles.intro}>
            <p className={styles.eyebrow}>Secure by design · Part {part} of 10</p>
            <h1>{title}</h1>
            <p className={styles.dek}>{description}</p>
          </header>
          <div className={styles.cover}>
            <Image src={image} alt={imageAlt} width={1672} height={941} priority sizes="(max-width: 767px) 100vw, 1200px" />
          </div>
          <div className={styles.articleBody}>
            <p className={styles.source}>Based on the joint CISA, NSA, FBI and international partners’ <a href="https://www.cisa.gov/sites/default/files/2023-10/SecureByDesign_1025_508c.pdf" target="_blank" rel="noreferrer">Secure by Design guidance</a>, especially pages {sourcePages}. The practical examples are applications of the guide, not a promise of complete security.</p>
            <h2>Summary in 100 points</h2>
            {sections.map((section, index) => (
              <section key={section.title} className={styles.section}>
                <h3>{section.title}</h3>
                <ol start={index * 10 + 1}>
                  {section.lines.map((line) => <li key={line}>{line}</li>)}
                </ol>
              </section>
            ))}
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
