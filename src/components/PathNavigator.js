"use client";

import { steps } from "@/lib/steps";
import styles from "./PathNavigator.module.css";

export default function PathNavigator({ activeStepId, onSelect, unlockedIndex = steps.length - 1 }) {
  return (
    <nav className={styles.nav} aria-label="Team journey" data-tour="path">
      <div className={styles.line} />
      <div className={styles.steps}>
        {steps.map((step, index) => {
          const locked = index > unlockedIndex;
          return (
            <button
              key={step.id}
              type="button"
              className={styles.step}
              data-active={step.id === activeStepId}
              data-locked={locked}
              aria-current={step.id === activeStepId ? "step" : undefined}
              aria-disabled={locked}
              disabled={locked}
              title={locked ? "Complete the current step's tasks to unlock" : undefined}
              onClick={() => onSelect(step.id)}
            >
              <span className={styles.dot} />
              <span className={styles.label}>{step.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
