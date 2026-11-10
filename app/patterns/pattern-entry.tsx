import { Dot, Elbow } from "../components/glyphs";
import { Diagram } from "./diagram";
import styles from "./patterns.module.css";
import type { Pattern } from "./types";

/** One pattern: a tool-call frame with definition, trade-offs as a diff, example, code and diagram. */
export function PatternEntry({ pattern, number }: { pattern: Pattern; number: string }) {
  const headingId = `${pattern.slug}-title`;
  return (
    <article id={pattern.slug} className={`tool ${styles.entry}`} aria-labelledby={headingId}>
      <div className="tool__head">
        <Dot />
        <span>
          <span className="tool__name">Pattern</span>
          <span className="tool__arg">({pattern.slug})</span>
        </span>
        <a className={styles.anchor} href={`#${pattern.slug}`} aria-label={`Link to ${pattern.name}`}>
          #{number}
        </a>
      </div>

      <div className={styles.entryGrid}>
        <div className={styles.entryCopy}>
          <h3 id={headingId} className={styles.entryName}>
            {pattern.name}
          </h3>
          <p className={styles.definition}>{pattern.definition}</p>

          <h4 className={styles.label}>Use it when</h4>
          <ul className={styles.useWhen} role="list">
            {pattern.useWhen.map((item) => (
              <li key={item}>
                <Elbow />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <h4 className={styles.label}>Trade-offs</h4>
          <ul className="diff" role="list" aria-label="Benefits and costs">
            {pattern.pros.map((item) => (
              <li key={item} className="diff__line" data-op="add">
                <span className="sr-only">Benefit: </span>
                {item}
              </li>
            ))}
            {pattern.cons.map((item) => (
              <li key={item} className="diff__line" data-op="del">
                <span className="sr-only">Cost: </span>
                {item}
              </li>
            ))}
          </ul>

          <h4 className={styles.label}>Example</h4>
          <p className={styles.example}>{pattern.example}</p>
        </div>

        <figure className={styles.figure}>
          {/* Scrolls sideways on narrow phones so labels stay readable; focusable for keyboard scrolling. */}
          <div
            className={styles.diagramScroll}
            tabIndex={0}
            role="group"
            aria-label={`${pattern.name} diagram`}
          >
            <Diagram spec={pattern.diagram} id={`d-${pattern.slug}`} />
          </div>
          <figcaption className={styles.figcaption}>fig. {number}</figcaption>
        </figure>
      </div>

      {pattern.code ? (
        <div className={styles.codeBlock}>
          <div className={styles.codeHead}>
            <span>{pattern.code.file}</span>
            <span className={styles.codeLang}>{pattern.code.lang}</span>
          </div>
          {/* Focusable so keyboard users can scroll long lines. */}
          <pre className={styles.code} tabIndex={0} aria-label={`${pattern.name} example code`}>
            <code>{pattern.code.source}</code>
          </pre>
        </div>
      ) : null}
    </article>
  );
}
