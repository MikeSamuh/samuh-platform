"use client";

import { steps } from "@/lib/steps";
import styles from "./PathNavigator.module.css";

export default function PathNavigator({ activeStepId, onSelect }) {
  return (
    <nav className={styles.nav} aria-label="Team journey">
      <div className={styles.line} />
      <div className={styles.steps}>
        {steps.map((step) => (
          <button
            key={step.id}
            type="button"
            className={styles.step}
            data-active={step.id === activeStepId}
            aria-current={step.id === activeStepId ? "step" : undefined}
            onClick={() => onSelect(step.id)}
          >
            <span className={styles.dot} />
            <span className={styles.label}>{step.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
