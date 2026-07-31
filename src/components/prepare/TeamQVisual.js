import styles from "./TeamQVisual.module.css";

const BAND_TIERS = [
  { label: "Thriving", color: "var(--band-thriving)" },
  { label: "Succeeding", color: "var(--band-succeeding)" },
  { label: "Managing", color: "var(--band-managing)" },
  { label: "Enduring", color: "var(--band-enduring)" },
  { label: "Struggling", color: "var(--band-struggling)" },
  { label: "Distressed", color: "var(--band-distressed)" },
];

// The score display, used for both TeamQ and OrgQ. The defaults are the
// illustrative TeamQ figures the app has always shown — there is no assessment
// data wired up yet.
export default function TeamQVisual({
  wordmark = "TeamQ",
  score = "73.7",
  capacity = "108",
  loss = "-14%",
  lossSub = "(3.1/22)",
}) {
  return (
    <div className={styles.visual}>
      <div className={styles.column}>
        <div className={styles.wordmark}>{wordmark}</div>
        <div className={styles.score}>{score}</div>
        <div className={styles.scoreUnit}>/100</div>
      </div>

      <div className={styles.column}>
        <div className={styles.label}>Capacity to perform</div>
        <div className={styles.capacityRow}>
          <span className={styles.pointer}>{capacity}</span>
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
        <div className={styles.loss}>{loss}</div>
        <div className={styles.lossSub}>{lossSub}</div>
      </div>
    </div>
  );
}
