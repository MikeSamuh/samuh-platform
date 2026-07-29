"use client";

import { Star } from "lucide-react";
import styles from "./VoteSection.module.css";

// Wraps the two result charts in one voting section with shared instructions.
export default function VoteSection({ children }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span className={styles.iconBox}>
          <Star size={16} />
        </span>
        <div>
          <div className={styles.title}>Vote on your results</div>
          <div className={styles.instructions}>
            You have <strong>one star for Team environment</strong> and{" "}
            <strong>one star for Team practices</strong>. In each section, click the star
            next to the row that matters most to you — click a different row to move your
            star. The practice with the most stars becomes the starting point for your
            practice canvas in the Action step.
          </div>
        </div>
      </div>
      <div className={styles.charts}>{children}</div>
    </div>
  );
}
