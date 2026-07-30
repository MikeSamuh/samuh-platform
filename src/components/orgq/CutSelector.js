"use client";

import { SlidersHorizontal } from "lucide-react";
import styles from "./Orgq.module.css";

// One control for the whole Results step: every visual below reads by the same
// cut, so switching axis re-frames the entire readout at once.
export default function CutSelector({ fields, value, onChange }) {
  if (fields.length <= 1) return null;

  return (
    <div className={styles.card}>
      <div className={styles.fieldRow}>
        <span className={styles.iconBox}>
          <SlidersHorizontal size={17} />
        </span>
        <div style={{ flex: 1, minWidth: 180 }}>
          <div className={styles.title}>Read the results by</div>
          <div className={styles.sub}>
            Every chart below re-slices to match
          </div>
        </div>
        <select
          className={styles.select}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Read the results by"
        >
          {fields.map((f) => (
            <option key={f.key} value={f.key}>
              {f.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
