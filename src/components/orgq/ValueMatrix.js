"use client";

import { LayoutGrid } from "lucide-react";
import { cutsFor } from "@/lib/orgq/roster";
import { cutScore, seededScore } from "@/lib/orgq/sampleData";
import shared from "./Orgq.module.css";
import styles from "./ValueMatrix.module.css";

// Need against value, so you can sequence which groups get a team journey
// first. Top-right is where the work pays back fastest.
export default function ValueMatrix({ people, cutKey, cutLabel }) {
  const cuts = cutsFor(people, cutKey);
  const field = cutLabel.toLowerCase();

  // `cut.value` is the cut's name; the two axes get their own names so they
  // can't shadow it.
  //
  // Need is ranked, not absolute. Averaging eight dimensions pulls every cut
  // hard toward the mean, so plotting 100 - score would bunch everything into
  // one column and leave the priority quadrant permanently empty — which reads
  // as "nothing needs attention". Spreading the cuts across the axis keeps the
  // ordering honest (worst score = highest need, matching the heat map) and
  // makes the comparison legible, which is the point of a 2x2.
  //
  // Value of intervening is a separate judgement — headcount, exposure,
  // influence — so it stays independent of the score.
  const scored = cuts.map((cut) => ({ name: cut.value, score: cutScore(cut.value) }));
  const scores = scored.map((s) => s.score);
  const min = Math.min(...scores);
  const span = Math.max(...scores) - min || 1;

  const plotted = scored.map((s) => {
    const need =
      scored.length === 1 ? 50 : Math.round(85 - ((s.score - min) / span) * 62);
    const impact = seededScore(`${s.name}|value`, 15, 92);
    return { name: s.name, need, impact, priority: need > 50 && impact > 50 };
  });

  return (
    <div className={shared.card} data-tour="matrix">
      <div className={shared.head}>
        <span className={shared.iconBox}>
          <LayoutGrid size={17} />
        </span>
        <div className={`${shared.headText} ${shared.headRow}`} style={{ flex: 1 }}>
          <div>
            <div className={shared.title}>Priority groups</div>
            <div className={shared.sub}>
              Need against value, by {field} — the highlighted quadrant is where to start
            </div>
          </div>
          <span className={shared.sampleTag}>Sample data</span>
        </div>
      </div>

      {plotted.length === 0 ? (
        <div className={shared.empty}>
          Fill in the {cutLabel} column on the roster to plot your groups.
        </div>
      ) : (
        <div className={styles.wrap}>
          <div className={styles.plotArea}>
            <div className={styles.yAxis}>Value of intervening →</div>
            <div className={styles.plotColumn}>
              <div className={styles.plot}>
                <div className={styles.priorityZone} />
                <span className={styles.quadrantLabel} style={{ right: 0, top: 0 }}>
                  Start here
                </span>
                <span className={styles.quadrantLabel} style={{ left: 0, bottom: 0 }}>
                  Monitor
                </span>
                {plotted.map((p) => (
                  <span
                    key={p.name}
                    className={styles.dot}
                    data-priority={p.priority}
                    style={{ left: `${p.need}%`, bottom: `${p.impact}%` }}
                    title={`${p.name} — need ${p.need}, value ${p.impact}`}
                  />
                ))}
              </div>
              <div className={styles.xAxis}>Level of need →</div>
            </div>
          </div>

          <div className={styles.key}>
            {plotted.map((p) => (
              <span key={p.name} className={styles.keyItem}>
                <span className={styles.keyDot} data-priority={p.priority} />
                <span className={styles.keyName} title={p.name}>
                  {p.name}
                </span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
