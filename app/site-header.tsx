import Link from "next/link";
import styles from "./page.module.css";

export function SiteHeader({ current }: { current?: "blog" }) {
  return (
    <header className={styles.header}>
      <Link className={styles.brand} href="/" aria-label="Syed Safdar Ali Shah home">
        <span className={styles.brandMark} aria-hidden="true">S</span>
        <span>Safdar Ali Shah</span>
      </Link>
      <nav className={styles.navigation} aria-label="Primary navigation">
        <Link href="/#work">Work</Link>
        <Link href="/#approach">Approach</Link>
        <Link href="/blog" aria-current={current === "blog" ? "page" : undefined}>Blog</Link>
        <Link href="/#contact">Contact</Link>
      </nav>
    </header>
  );
}
