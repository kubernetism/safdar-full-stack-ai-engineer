import styles from "./page.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <p>© 2026 Syed Safdar Ali Shah</p>
      <div>
        <a href="https://github.com/kubernetism" target="_blank" rel="noreferrer">GitHub</a>
        <a href="https://www.linkedin.com/in/kubernetism/" target="_blank" rel="noreferrer">LinkedIn</a>
      </div>
    </footer>
  );
}
