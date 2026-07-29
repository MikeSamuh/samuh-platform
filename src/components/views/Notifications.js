"use client";

import { BellOff } from "lucide-react";
import styles from "./Views.module.css";

export default function Notifications({ team, isStaff }) {
  const cadenceLabel = { biweekly: "every two weeks", monthly: "once a month" }[
    team?.feedbackCadence
  ];

  return (
    <div className={styles.panel}>
      <span className={styles.eyebrow}>Notifications</span>
      <div className={styles.card}>
        <div className={styles.cardTitle}>
          <BellOff size={14} style={{ verticalAlign: "-2px", marginRight: 7 }} />
          Nothing yet
        </div>
        <div className={styles.emptyState}>
          Team activity and reminders will appear here — task completions, survey
          responses, and ritual keeper check-ins.
          {!isStaff && cadenceLabel && (
            <>
              {" "}
              Feedback emails are set to go out <strong>{cadenceLabel}</strong> once email
              sending is connected.
            </>
          )}
        </div>
      </div>
    </div>
  );
}
