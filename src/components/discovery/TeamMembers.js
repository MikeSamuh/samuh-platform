"use client";

import { useState } from "react";
import { X } from "lucide-react";
import styles from "./TeamMembers.module.css";

export default function TeamMembers({ members, onAdd, onRemove }) {
  const [value, setValue] = useState("");

  function handleAdd() {
    const trimmed = value.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setValue("");
  }

  return (
    <div className={styles.card}>
      <div className={styles.title}>Team members ({members.length})</div>
      <div className={styles.chips}>
        {members.map((name, i) => (
          <span key={`${name}-${i}`} className={styles.chip}>
            {name}
            <button
              type="button"
              className={styles.remove}
              onClick={() => onRemove(i)}
              aria-label={`Remove ${name}`}
            >
              <X size={13} />
            </button>
          </span>
        ))}
      </div>
      <div className={styles.addRow}>
        <input
          className={styles.input}
          placeholder="Add a team member"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAdd();
          }}
        />
        <button type="button" className={styles.addButton} onClick={handleAdd}>
          Add
        </button>
      </div>
    </div>
  );
}
