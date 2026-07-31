"use client";

import { Route } from "lucide-react";
import { teamJourney } from "@/lib/journeys/team";
import { isStepComplete } from "@/lib/journeys/progress";
import shared from "./Orgq.module.css";
import styles from "./TeamJourneyReview.module.css";

// The one OrgQ module reading genuine data: how far this team actually got
// through their own journey. Org-wide roll-up needs an org entity, which the
// schema doesn't have yet.
export default function TeamJourneyReview({ taskChecks }) {
  const rows = teamJourney.steps.map((step) => {
    const tasks = teamJourney.stepTasks[step.id] || [];
    const done = (taskChecks[step.id] || []).filter((id) =>
      tasks.some((t) => t.id === id)
    ).length;
    return {
      ...step,
      done,
      total: tasks.length,
      complete: isStepComplete(teamJourney, step.id, taskChecks),
    };
  });

  const finished = rows.filter((r) => r.complete).length;

  return (
    <div className={shared.card} data-tour="review">
      <div className={shared.head}>
        <span className={shared.iconBox}>
          <Route size={17} />
        </span>
        <div className={shared.headText}>
          <div className={shared.title}>Team journey progress</div>
          <div className={shared.sub}>
            {`${finished} of ${rows.length} steps complete on this team's journey`}
          </div>
        </div>
      </div>

      {rows.map((r) => (
        <div key={r.id} className={styles.row}>
          <span className={styles.label}>{r.label}</span>
          <div className={styles.track}>
            <div
              className={styles.fill}
              data-complete={r.complete}
              style={{ width: `${r.total ? (r.done / r.total) * 100 : 0}%` }}
            />
          </div>
          <span className={styles.count}>
            {r.done} / {r.total}
          </span>
        </div>
      ))}

      <div className={shared.hint}>
        This is the team attached to your account. Rolling every team in the org up into
        one view needs org-level data, which isn&apos;t wired up yet.
      </div>
    </div>
  );
}
