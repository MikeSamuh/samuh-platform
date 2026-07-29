"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import styles from "./GuidedTour.module.css";

function getRect(target) {
  const el = document.querySelector(`[data-tour="${target}"]`);
  if (!el) return null;
  return el.getBoundingClientRect();
}

export default function GuidedTour({ stops, onClose, onComplete }) {
  // Some targets only exist for certain roles (e.g. the admin icon, the team
  // name card), so tour only the stops actually on screen.
  const [tourSteps] = useState(() =>
    stops.filter((s) => document.querySelector(`[data-tour="${s.target}"]`))
  );
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState(null);

  const step = tourSteps[index] || null;

  // Nothing on screen to tour (shouldn't happen, but never crash a step).
  useEffect(() => {
    if (tourSteps.length === 0) onComplete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    if (!step) return;
    const el = document.querySelector(`[data-tour="${step.target}"]`);
    if (el) el.scrollIntoView({ block: "center", behavior: "instant" });
    setRect(getRect(step.target));
  }, [step?.target]);

  useEffect(() => {
    if (!step) return;
    function update() {
      setRect(getRect(step.target));
    }
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [step?.target]);

  if (!step) return null;

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
