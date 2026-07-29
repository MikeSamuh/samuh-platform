"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import styles from "./GuidedTour.module.css";

const TOUR_STEPS = [
  {
    target: "path",
    title: "Your team journey",
    body: "Five steps: Prepare, Launch, Awareness, Belonging, Action. Finish a step's tasks to unlock the next one — you can always go back.",
  },
  {
    target: "checklist",
    title: "Step tasks",
    body: "Everything to do on this step lives here. Tasks check themselves off as you watch, read, and complete each module.",
  },
  {
    target: "media",
    title: "Watch, read, listen",
    body: "Each step has videos, guides, and recordings. Open a tile to play it — that counts as completing the task.",
  },
  {
    target: "members",
    title: "Your team",
    body: "Add teammates with their name, email, and tenure — one at a time, or upload a spreadsheet (there's a template to download).",
  },
  {
    target: "colead",
    title: "Pick a co-lead",
    body: "Once your team is in, choose a co-lead to share the journey with you.",
  },
  {
    target: "admin",
    title: "Track progress",
    body: "The activity icon opens the team progress dashboard — step completion, milestones, and who's participated.",
  },
];

function getRect(target) {
  const el = document.querySelector(`[data-tour="${target}"]`);
  if (!el) return null;
  return el.getBoundingClientRect();
}

export default function GuidedTour({ onClose, onComplete }) {
  // Some targets only exist for certain roles (e.g. the admin icon), so tour
  // only the stops actually on screen.
  const [tourSteps] = useState(() =>
    TOUR_STEPS.filter((s) => document.querySelector(`[data-tour="${s.target}"]`))
  );
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState(null);

  const step = tourSteps[index];

  useLayoutEffect(() => {
    const el = document.querySelector(`[data-tour="${step.target}"]`);
    if (el) el.scrollIntoView({ block: "center", behavior: "instant" });
    setRect(getRect(step.target));
  }, [step.target]);

  useEffect(() => {
    function update() {
      setRect(getRect(step.target));
    }
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [step.target]);

  function handleNext() {
    if (index === tourSteps.length - 1) {
      onComplete();
    } else {
      setIndex(index + 1);
    }
  }

  const pad = 6;
  const highlightStyle = rect
    ? {
        top: rect.top - pad,
        left: rect.left - pad,
        width: rect.width + pad * 2,
        height: rect.height + pad * 2,
      }
    : { display: "none" };

  const popupTop = rect
    ? rect.bottom + 14 + 170 < window.innerHeight
      ? rect.bottom + 14
      : Math.max(16, rect.top - 184)
    : 100;
  const popupLeft = rect
    ? Math.min(Math.max(16, rect.left), window.innerWidth - 316)
    : 100;

  return (
    <>
      <div className={styles.backdrop} onClick={onClose} />
      <div className={styles.highlight} style={highlightStyle} />
      <div className={styles.popup} style={{ top: popupTop, left: popupLeft }}>
        <div className={styles.stepCount}>
          {index + 1} of {tourSteps.length}
        </div>
        <div className={styles.popupTitle}>{step.title}</div>
        <div className={styles.popupBody}>{step.body}</div>
        <div className={styles.controls}>
          <button type="button" className={styles.skip} onClick={onClose}>
            Skip tour
          </button>
          <div className={styles.navButtons}>
            {index > 0 && (
              <button type="button" className={styles.back} onClick={() => setIndex(index - 1)}>
                Back
              </button>
            )}
            <button type="button" className={styles.next} onClick={handleNext}>
              {index === tourSteps.length - 1 ? "Finish tour" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
