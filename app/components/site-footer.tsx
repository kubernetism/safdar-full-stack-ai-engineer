import { profile } from "../content";
import { Arrow } from "./glyphs";
import { RebuildButton } from "./rebuild-button";
import { Sprite } from "./sprite";
import styles from "./site-chrome.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`shell ${styles.footerInner}`}>
        <p className={styles.statusLine}>
          <Sprite size={22} mode="still" />
          <span className={styles.statusSeg}>safdar ~/portfolio</span>
          <span className={styles.statusSeg} aria-hidden="true">
            main
          </span>
          <span className={`${styles.statusSeg} ${styles.statusOk}`}>Built with Claude Code</span>
        </p>
        <ul className={styles.footerLinks} role="list" aria-label="Elsewhere">
          <li>
            <a href={profile.github} target="_blank" rel="noreferrer">
              GitHub <Arrow direction="up-right" size="0.9em" />
            </a>
          </li>
          <li>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">
              LinkedIn <Arrow direction="up-right" size="0.9em" />
            </a>
          </li>
          <li>
            <a href={`mailto:${profile.email}`}>Email</a>
          </li>
          <li>
            <RebuildButton className={styles.footerRebuild} />
          </li>
        </ul>
        <p className={styles.copyright}>© 2026 {profile.name}</p>
      </div>
      <p className={styles.wordmark} aria-hidden="true">
        SAFDAR ALI SHAH
      </p>
    </footer>
  );
}
