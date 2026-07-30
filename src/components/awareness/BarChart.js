"use client";

import { Star } from "lucide-react";
import styles from "./BarChart.module.css";

// `max` is the value a full-width bar represents — 9 for the team vote charts,
// 100 where the rows are percentages.
export default function BarChart({
  title,
  rows,
  color,
  max = 9,
  suffix = "",
  authors = [],
  votes = {},
  onVote,
}) {
  return (
    <div className={styles.card}>
      <div className={styles.title}>{title}</div>
      <div className={styles.rows}>
        {rows.map((row) => {
          const voters = Object.entries(votes)
            .filter(([, label]) => label === row.label)
            .map(([id]) => authors.find((a) => a.id === id))
            .filter(Boolean);

          return (
            <div key={row.label} className={styles.row}>
              <span className={styles.label}>{row.label}</span>
              <div className={styles.track}>
                <div
                  className={styles.bar}
                  style={{ width: `${(row.value / max) * 100}%`, background: color }}
                >
                  <span className={styles.value}>
                    {row.value}
                    {suffix}
                  </span>
                </div>
              </div>
              {onVote && (
                <button
                  type="button"
                  className={styles.voteButton}
                  onClick={() => onVote(row.label)}
                  aria-label={`Vote for ${row.label}`}
                  title={
                    voters.length
                      ? `${voters.length} vote${voters.length > 1 ? "s" : ""}`
                      : "Place your star"
                  }
                >
                  {voters.length === 0 && (
                    <Star size={13} className={styles.voteGhost} />
                  )}
                  {voters.map((voter) => (
                    <Star
                      key={voter.id}
                      size={13}
                      fill={voter.color}
                      color={voter.color}
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
