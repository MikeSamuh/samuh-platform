"use client";

import styles from "./AuthorPicker.module.css";

export default function AuthorPicker({ label, emptyLabel, authors, value, onChange }) {
  if (authors.length === 0) {
    return emptyLabel ? <span className={styles.empty}>{emptyLabel}</span> : null;
  }

  return (
    <div className={styles.picker}>
      <span className={styles.label}>{label}</span>
      <div className={styles.avatars}>
        {authors.map((a, i) => (
          <button
            key={a.name}
            type="button"
            className={styles.avatar}
            data-active={i === value}
            style={{ background: a.color }}
            onClick={() => onChange(i)}
            title={a.name}
          >
            {a.name[0]}
          </button>
        ))}
      </div>
    </div>
  );
}
