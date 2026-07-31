"use client";

import styles from "./PathNavigator.module.css";

// `steps` is required — defaulting it to the team journey's list would let a
// second journey silently render the wrong path.
export default function PathNavigator({
  steps,
  navLabel = "Team journey",
  activeStepId,
  onSelect,
  unlockedIndex = steps.length - 1,
}) {
  const activeIndex = Math.max(
    0,
    steps.findIndex((s) => s.id === activeStepId)
  );
  // Fraction of the track to fill, 0 → 1 across the dots.
  const progress = steps.length > 1 ? activeIndex / (steps.length - 1) : 0;

  return (
    <nav className={styles.nav} aria-label={navLabel} data-tour="path">
      <div
        className={styles.steps}
        style={{ "--step-count": steps.length, "--progress": progress }}
      >
        {steps.map((step, index) => {
          const locked = index > unlockedIndex;
          return (
            <button
              key={step.id}
              type="button"
              className={styles.step}
              data-active={step.id === activeStepId}
              data-done={index < activeIndex}
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
