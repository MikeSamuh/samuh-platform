import styles from "./TeamQVisual.module.css";

const BAND_TIERS = [
  { label: "Thriving", color: "var(--band-thriving)" },
  { label: "Succeeding", color: "var(--band-succeeding)" },
  { label: "Managing", color: "var(--band-managing)" },
  { label: "Enduring", color: "var(--band-enduring)" },
  { label: "Struggling", color: "var(--band-struggling)" },
  { label: "Distressed", color: "var(--band-distressed)" },
];

export default function TeamQVisual() {
  return (
    <div className={styles.visual}>
      <div className={styles.column}>
        <div className={styles.wordmark}>TeamQ</div>
        <div className={styles.score}>73.7</div>
        <div className={styles.scoreUnit}>/100</div>
      </div>

      <div className={styles.column}>
        <div className={styles.label}>Capacity to perform</div>
        <div className={styles.capacityRow}>
          <span className={styles.pointer}>108</span>
          <div className={styles.band}>
            {BAND_TIERS.map((tier) => (
              <div key={tier.label} className={styles.tier}>
                <span className={styles.swatch} style={{ background: tier.color }} />
                <span className={styles.tierLabel}>{tier.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.column}>
        <div className={styles.label}>Performance loss</div>
        <div className={styles.loss}>-14%</div>
        <div className={styles.lossSub}>(3.1/22)</div>
      </div>
    </div>
  );
}
