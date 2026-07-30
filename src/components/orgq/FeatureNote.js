"use client";

import { Info } from "lucide-react";
import styles from "./Orgq.module.css";

// The flow diagram lists per-step "features" alongside the tasks — things the
// platform does rather than things you do. They aren't checklist items, so they
// render as a quiet note instead of a task card.
export default function FeatureNote({ title, points }) {
  return (
    <div className={styles.card}>
      <div className={styles.head}>
        <span className={styles.iconBox}>
          <Info size={17} />
        </span>
        <div className={styles.headText}>
          <div className={styles.title}>{title}</div>
          <div className={styles.sub}>What the platform handles on this step</div>
        </div>
      </div>
      <ul className={styles.guidance}>
        {points.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
    </div>
  );
}
