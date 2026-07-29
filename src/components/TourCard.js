"use client";

import { Compass, Play } from "lucide-react";
import styles from "@/components/CoachingCard.module.css";

export default function TourCard({ onStart, completed, stepLabel }) {
  return (
    <div className={styles.card} data-tour="tour-card">
      <div className={styles.info}>
        <span className={styles.iconBox}>
          <Compass size={17} />
        </span>
        <span>
          <div className={styles.title}>
            Virtual walkthrough{stepLabel ? ` — ${stepLabel}` : ""}
          </div>
          <div className={styles.sub}>
            {completed
              ? "Walkthrough complete — take it again any time"
              : "A guided walkthrough of everything on this step"}
          </div>
        </span>
      </div>
      <button type="button" className={styles.button} onClick={onStart}>
        <Play size={13} />
        {completed ? "Retake walkthrough" : "Start walkthrough"}
      </button>
    </div>
  );
}
