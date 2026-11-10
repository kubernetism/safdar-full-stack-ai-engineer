import Link from "next/link";
import { RebuildButton } from "./rebuild-button";
import { Sprite } from "./sprite";
import { ThemeToggle } from "./theme-toggle";
import styles from "./site-chrome.module.css";

const NAV = [
  { href: "/#work", label: "work", key: "work" },
  { href: "/#skills", label: "skills", key: "skills" },
  { href: "/blog", label: "blog", key: "blog" },
  { href: "/patterns", label: "patterns", key: "patterns" },
  { href: "/fde", label: "fde", key: "fde" },
  { href: "/#contact", label: "contact", key: "contact" },
] as const;

export function SiteHeader({ current }: { current?: "blog" | "patterns" | "fde" }) {
  return (
    <header className={`band ${styles.header}`}>
      <div className={`shell ${styles.headerInner}`}>
        <Link className={styles.brand} href="/" aria-label="Syed Safdar Ali Shah, home">
          <Sprite size={26} mode="idle" />
          <span className={styles.brandName}>safdar</span>
          <span className={styles.brandPath} aria-hidden="true">
            ~/portfolio
          </span>
        </Link>
        <nav className={styles.nav} aria-label="Primary">
          <ul role="list">
            {NAV.map((item) => (
              <li key={item.key}>
                <Link href={item.href} aria-current={current === item.key ? "page" : undefined}>
                  <span aria-hidden="true">/</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <ThemeToggle className={styles.themeToggle} labelClassName={styles.themeLabel} />
        <RebuildButton className={styles.rebuild} />
      </div>
    </header>
  );
}
