"use client";

import { Check, Minus, Users, UserCheck, Play, Flame } from "lucide-react";
import { steps } from "@/lib/steps";
import { stepTasks } from "@/lib/stepTasks";
import { getAuthors } from "@/lib/authors";
import styles from "./AdminDashboard.module.css";

function Mark({ done }) {
  return done ? (
    <Check size={14} className={styles.check} />
  ) : (
    <Minus size={14} className={styles.dash} />
  );
}

export default function AdminDashboard({
  members,
  coLead,
  launched,
  ritualKeeper,
  cardPicks,
  votes,
  reflections,
  taskChecks,
}) {
  const authors = getAuthors(members);

  const milestones = [
    { id: "members", label: "Team members added", icon: Users, done: members.length > 0 },
    { id: "colead", label: "Co-lead identified", icon: UserCheck, done: Boolean(coLead) },
    { id: "launched", label: "TeamQ+ launched", icon: Play, done: launched },
    { id: "keeper", label: "Ritual keeper selected", icon: Flame, done: Boolean(ritualKeeper) },
  ];

  return (
    <div className={styles.panel}>
      <span className={styles.eyebrow}>Admin &middot; team progress</span>

      <div className={styles.card}>
        <div className={styles.cardTitle}>Journey progress</div>
        {steps.map((step) => {
          const tasks = stepTasks[step.id] || [];
          const checked = taskChecks[step.id] || [];
          const done = tasks.filter((t) => checked.includes(t.id)).length;
          const complete = tasks.length > 0 && done === tasks.length;
          return (
            <div key={step.id} className={styles.stepRow}>
              <span className={styles.stepLabel}>{step.label}</span>
              <div className={styles.track}>
                <div
                  className={styles.fill}
                  data-complete={complete}
                  style={{ width: `${tasks.length ? (done / tasks.length) * 100 : 0}%` }}
                />
              </div>
              <span className={styles.stepCount}>
                {done} / {tasks.length}
              </span>
            </div>
          );
        })}
      </div>

      <div className={styles.card}>
        <div className={styles.cardTitle}>Team milestones</div>
        <div className={styles.milestones}>
          {milestones.map(({ id, label, icon: Icon, done }) => (
            <div key={id} className={styles.milestone} data-done={done}>
              <Icon size={15} className={styles.milestoneIcon} />
              {label}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardTitle}>Member participation</div>
        {authors.length === 0 ? (
          <div className={styles.empty}>Add team members on Prepare to see participation.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Member</th>
                <th>Metaphor card</th>
                <th>Environment vote</th>
                <th>Practices vote</th>
                <th>Reflections</th>
              </tr>
            </thead>
            <tbody>
              {authors.map((a) => {
                const reflectionCount = reflections.filter((r) => r.authorId === a.id).length;
                return (
                  <tr key={a.id}>
                    <td>
                      <span className={styles.memberName} style={{ color: a.color }}>
                        {a.name}
                      </span>
                      {coLead === a.id && <span className={styles.badge}>Co-lead</span>}
                      {ritualKeeper === a.id && <span className={styles.badge}>Ritual keeper</span>}
                    </td>
                    <td>
                      <Mark done={Boolean(cardPicks[a.id])} />
                    </td>
                    <td>
                      <Mark done={Boolean(votes.environment[a.id])} />
                    </td>
                    <td>
                      <Mark done={Boolean(votes.practices[a.id])} />
                    </td>
                    <td>{reflectionCount > 0 ? reflectionCount : <Mark done={false} />}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
