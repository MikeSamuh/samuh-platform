"use client";

import { CheckCircle2 } from "lucide-react";
import styles from "./StepChecklist.module.css";

export default function StepChecklist({ stepId, tasks, checked, onToggle }) {
  const doneCount = tasks.filter((t) => checked.includes(t.id)).length;
  const allDone = doneCount === tasks.length;

  return (
    <aside className={styles.checklist} aria-label="Step tasks" data-tour="checklist">
      <div className={styles.title}>Step tasks</div>
      <div className={styles.progress}>
        {doneCount} of {tasks.length} complete &middot; auto-checks as you go, or tick them yourself
      </div>
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
              <label htmlFor={inputId} className={styles.label}>
                {task.label}
              </label>
            </li>
          );
        })}
      </ul>
      {allDone && (
        <div className={styles.done}>
          <CheckCircle2 size={14} />
          Step complete
        </div>
      )}
    </aside>
  );
}
