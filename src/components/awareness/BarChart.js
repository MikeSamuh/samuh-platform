"use client";

import { Star } from "lucide-react";
import styles from "./BarChart.module.css";

export default function BarChart({ title, rows, color, authors = [], votes = {}, onVote }) {
  return (
    <div className={styles.card}>
      <div className={styles.title}>{title}</div>
      <div className={styles.rows}>
        {rows.map((row) => {
          const voterIndices = Object.entries(votes)
            .filter(([, label]) => label === row.label)
            .map(([idx]) => Number(idx));

          return (
            <div key={row.label} className={styles.row}>
              <span className={styles.label}>{row.label}</span>
              <div className={styles.track}>
                <div
                  className={styles.bar}
                  style={{ width: `${(row.value / 9) * 100}%`, background: color }}
                >
                  <span className={styles.value}>{row.value}</span>
                </div>
              </div>
              {onVote && (
                <button
                  type="button"
                  className={styles.voteButton}
                  onClick={() => onVote(row.label)}
                  aria-label={`Vote for ${row.label}`}
                  title={
                    voterIndices.length
                      ? `${voterIndices.length} vote${voterIndices.length > 1 ? "s" : ""}`
                      : "Place your star"
                  }
                >
                  {voterIndices.length === 0 && (
                    <Star size={13} className={styles.voteGhost} />
                  )}
                  {voterIndices.map((idx) => (
                    <Star
                      key={idx}
                      size={13}
                      fill={authors[idx]?.color || "currentColor"}
                      color={authors[idx]?.color || "currentColor"}
                    />
                  ))}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
