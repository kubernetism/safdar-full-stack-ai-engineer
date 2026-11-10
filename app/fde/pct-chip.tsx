import type { FdeItem } from "./types";
import styles from "./fde.module.css";

/** The posting-share chip, exactly as in the source checklist ("87%", "15%*", "*", "<=11%"). */
export function PctChip({ pct, large = false }: { pct: FdeItem["pct"]; large?: boolean }) {
  const assumed = pct.includes("*");
  const label =
    pct === "*"
      ? "Assumed: employers expect it, so postings rarely mention it"
      : `Mentioned in ${pct.replace("*", "").replace("<=", "up to ")} of postings${assumed ? "; also assumed by employers" : ""}`;
  return (
    <span
      className={`${styles.chip} ${large ? styles.chipLarge : ""}`}
      data-assumed={assumed ? "" : undefined}
      title={label}
    >
      <span aria-hidden="true">{pct}</span>
      <span className="sr-only">{label}</span>
    </span>
  );
}

export function TierBadge({ tier }: { tier: FdeItem["tier"] }) {
  const text = tier === "high" ? "High" : tier === "medium" ? "Medium" : "Nice-to-have";
  return (
    <span className={styles.tier} data-tier={tier}>
      {text}
    </span>
  );
}
