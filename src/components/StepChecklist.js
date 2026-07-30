"use client";

import { CheckCircle2 } from "lucide-react";
import styles from "./StepChecklist.module.css";

export default function StepChecklist({ stepId, tasks, checked, onToggle }) {
  const doneCount = tasks.filter((t) => checked.includes(t.id)).length;
  const allDone = doneCount === tasks.length;

  return (
    <aside className={styles.checklist} aria-label="Tasks" data-tour="checklist">
      <div className={styles.title}>Tasks</div>
      <ul className={styles.items}>
        {tasks.map((task) => {
          const done = checked.includes(task.id);
          const inputId = `task-${stepId}-${task.id}`;
          return (
            <li key={task.id} className={styles.item} data-done={done}>
              <input
                id={inputId}
                type="checkbox"
                className={styles.checkbox}
                checked={done}
                onChange={() => onToggle?.(stepId, task.id)}
              />
              {/* Labels only — the task's `sub` is still in the task tables,
                  but the list reads better as a plain set of things to do. */}
              <label htmlFor={inputId} className={styles.labelBlock}>
                <span className={styles.label}>{task.label}</span>
              </label>
            </li>
          );
        })}
      </ul>
      {allDone && (
        <div className={styles.done}>
          <CheckCircle2 size={16} />
          Step complete
        </div>
      )}
    </aside>
  );
}
