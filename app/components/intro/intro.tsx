import type { ReactNode } from "react";
import { Check, Dot, Elbow, Spark } from "../glyphs";
import { InlineScript } from "../inline-script";
import { Sprite } from "../sprite";
import { IntroController } from "./intro-controller";
import styles from "./intro.module.css";
import {
  BLOCKS,
  INTRO_DURATION_MS,
  PROMPT,
  T,
  TERM_ROWS,
  rowHeight,
  seconds,
  spritePathKeyframes,
  styledAt,
  transcriptScrollKeyframes,
  type BlockId,
  type ResultLine,
  type TermRow,
} from "./timeline";

export const INTRO_ID = "intro";
const SPRITE_PATH = "intro-sprite-path";
const TRANSCRIPT_SCROLL = "intro-transcript-scroll";

/**
 * Runs during HTML parsing, before first paint. It decides whether this
 * visit plays the intro: never with reduced motion, never twice per
 * session, never without storage. Without JS the overlay stays hidden.
 */
const BOOT_SCRIPT = `(function(){try{var r=document.getElementById("${INTRO_ID}");if(!r)return;if(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches)return;var s=window.sessionStorage;if(s.getItem("intro:played"))return;s.setItem("intro:played","1");r.setAttribute("data-state","play");window.__introT0=performance.now()}catch(e){}})()`;

/**
 * The hero build animation: a Claude Code style session builds the site
 * while the sprite assembles a live preview, then the preview gives way to
 * the real, server-rendered page underneath. Pure CSS timeline from first
 * paint; the client controller only adds skip, replay and cleanup.
 */
export function Intro() {
  return (
    <div
      id={INTRO_ID}
      className={styles.root}
      data-nosnippet
      suppressHydrationWarning
      style={{
        "--t-style": seconds(T.styleStart),
        "--t-sweep": seconds(T.styleSweep),
        "--t-done": seconds(T.done),
        "--t-exit": seconds(T.exit),
        "--t-end": seconds(T.end),
      }}
    >
      <InlineScript html={BOOT_SCRIPT} />
      <style href="intro-sprite-path" precedence="default">
        {spritePathKeyframes(SPRITE_PATH) + transcriptScrollKeyframes(TRANSCRIPT_SCROLL)}
      </style>

      <div className={styles.stage} aria-hidden="true">
        <div className={styles.topbar}>
          <span className={styles.topbarTitle}>
            <Spark className={styles.topbarSpark} />
            session 001 · building ~/portfolio
          </span>
          <span className={styles.topbarHint}>esc to skip</span>
        </div>

        <div className={styles.panes}>
          <Terminal />
          <Preview />
        </div>
      </div>

      <div className={styles.controls}>
        <button type="button" className={`btn ${styles.skip}`} data-intro-skip>
          Skip intro <kbd>esc</kbd>
        </button>
      </div>

      <IntroController rootId={INTRO_ID} durationMs={INTRO_DURATION_MS} />
    </div>
  );
}

/* ---------------- Terminal ---------------- */

/** A terminal line: laid out from the start at a fixed height, fades in at its time. */
function Row({ row, className, children }: { row: TermRow; className?: string; children: ReactNode }) {
  return (
    <div className={styles.row} style={{ "--d": seconds(row.at), "--h": rowHeight(row) }}>
      <div className={`${styles.rowBox} ${className ?? ""}`}>{children}</div>
    </div>
  );
}

function TermLine({ row }: { row: TermRow }) {
  switch (row.kind) {
    case "banner":
      return (
        <Row row={row} className={styles.banner}>
          <Sprite size={30} mode="typing" />
          <span>
            <strong>new session</strong>
            <br />
            <span className={styles.dim}>cwd ~/portfolio · branch main</span>
          </span>
        </Row>
      );
    case "prompt":
      return (
        <Row row={row} className={styles.prompt}>
          <span className={styles.promptMark}>&gt;</span>
          <span
            className={styles.promptText}
            style={{ "--chars": PROMPT.length, "--dur": seconds(T.promptEnd - T.promptStart) }}
          >
            <span className={styles.typed}>{PROMPT}</span>
            <span className={styles.promptCursor} />
          </span>
        </Row>
      );
    case "tool":
      return (
        <Row row={row} className={styles.tool}>
          <span className={styles.bullet} />
          <span>
            <strong>{row.tool}</strong>
            <span className={styles.dim}>({row.arg})</span>
          </span>
        </Row>
      );
    case "result":
      return <ResultRow row={row} line={row.line} />;
    case "permission":
      return (
        <Row row={row} className={styles.permission}>
          <p className={styles.permissionTitle}>Bash command</p>
          <p className={styles.permissionCmd}>npm run build</p>
          <p className={styles.permissionAsk}>Do you want to proceed?</p>
          <p
            className={`${styles.permissionOpt} ${styles.permissionYes}`}
            style={{ "--pick": seconds(T.permissionPick) }}
          >
            <span className={styles.permissionCaret}>&gt;</span> 1. Yes
          </p>
          <p className={styles.permissionOpt}>
            <span className={styles.permissionCaret} /> 2. No, tell Claude what to do differently
          </p>
        </Row>
      );
    case "done":
      return (
        <Row row={row} className={styles.done}>
          <Dot tone="accent" />
          <span>
            Done. Portfolio built in <strong>6s</strong>.
          </span>
        </Row>
      );
  }
}

function ResultRow({ row, line }: { row: TermRow; line: ResultLine }) {
  switch (line.kind) {
    case "note":
      return (
        <Row row={row} className={styles.result}>
          <Elbow />
          {line.text}
        </Row>
      );
    case "ok":
      return (
        <Row row={row} className={`${styles.result} ${styles.ok}`}>
          <Elbow />
          <Check size="0.95em" />
          <span>{line.text}</span>
        </Row>
      );
    case "add":
    case "del":
      return (
        <Row row={row} className={`${styles.diffRow} ${line.kind === "add" ? styles.add : styles.del}`}>
          <span className={styles.diffSign}>{line.kind === "add" ? "+" : "−"}</span>
          <span>{line.text}</span>
        </Row>
      );
  }
}

function Terminal() {
  return (
    <section className={styles.term}>
      <div className={styles.termBar}>
        <span className={styles.termDots}>
          <i />
          <i />
          <i />
        </span>
        <span className={styles.termTitle}>claude — ~/portfolio</span>
      </div>

      <div className={styles.termBody}>
        <div className={styles.rows} style={{ "--scroll": TRANSCRIPT_SCROLL }}>
          {TERM_ROWS.map((row, i) => (
            <TermLine key={i} row={row} />
          ))}
        </div>
      </div>

      <div className={styles.status}>
        <span className={styles.statusRun}>
          <Spark className={styles.spinner} />
          <span>
            Building… (<span className={styles.elapsed} />· esc to skip)
          </span>
        </span>
        <span className={styles.statusDone}>
          <Check size="0.95em" /> built · 0 errors
        </span>
        <span className={styles.statusMode}>» auto-accept on</span>
      </div>
    </section>
  );
}

/* ---------------- Preview ---------------- */

function Preview() {
  return (
    <section className={styles.preview}>
      <div className={styles.chrome}>
        <span className={styles.chromeUrl}>localhost:3000</span>
        <span className={styles.chromeLive}>live</span>
      </div>
      <div className={styles.viewport}>
        {BLOCKS.map((block) => {
          const [x, y, w, h] = block.rect;
          return (
            <div
              key={block.id}
              className={styles.block}
              data-block={block.id}
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: `${w}%`,
                height: `${h}%`,
                "--d": seconds(block.at),
                "--s": seconds(styledAt(block)),
              }}
            >
              <div className={styles.wire}>
                <span className={styles.wireLabel}>{block.label}</span>
                <span className={styles.wireBar} />
                <span className={styles.wireBar} />
              </div>
              <div className={styles.styled}>
                <StyledBlock id={block.id} />
              </div>
            </div>
          );
        })}

        <div className={styles.sweep} />

        <div className={styles.sprite} style={{ "--path": SPRITE_PATH }}>
          <Sprite size="100%" mode="walking" />
        </div>
      </div>
    </section>
  );
}

function StyledBlock({ id }: { id: BlockId }) {
  switch (id) {
    case "header":
      return (
        <div className={styles.sHeader}>
          <span className={styles.sBrand}>
            <i /> safdar
          </span>
          <span className={styles.sNav}>
            <i>/work</i>
            <i>/skills</i>
            <i>/blog</i>
            <i>/contact</i>
          </span>
        </div>
      );
    case "hero":
      return (
        <div className={styles.sHero}>
          <span className={styles.sKicker}>&gt; whoami</span>
          <span className={styles.sName}>
            SAFDAR
            <br />
            ALI SHAH
            <i />
          </span>
          <span className={styles.sTag}>Practical AI, built to ship.</span>
        </div>
      );
    case "card1":
    case "card2":
    case "card3":
    case "card4":
      return (
        <div className={styles.sCard} data-card={id}>
          <span className={styles.sShot} />
          <span className={styles.sCardName}>
            {id === "card1" ? "Maaher.pk" : id === "card2" ? "Rise" : id === "card3" ? "KR Cyber" : "Threats"}
          </span>
        </div>
      );
    case "writing":
      return (
        <div className={styles.sWriting}>
          <span className={styles.sRow}>
            <i />
            Secure by design
          </span>
          <span className={styles.sRow}>
            <i />
            Secure by default
          </span>
          <span className={styles.sRow}>
            <i />
            Who owns customer security?
          </span>
        </div>
      );
    case "contact":
      return (
        <div className={styles.sContact}>
          <span>Have a system worth improving?</span>
        </div>
      );
    case "footer":
      return <div className={styles.sFooter}>SAFDAR ALI SHAH</div>;
  }
}
