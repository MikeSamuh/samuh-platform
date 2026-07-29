"use client";

import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import styles from "./TeamName.module.css";

export default function TeamName({ team, canRename, onRename }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(team?.name || "");

  useEffect(() => {
    setValue(team?.name || "");
  }, [team?.name]);

  if (!team) return null;

  function commit() {
    setEditing(false);
    if (value.trim() && value.trim() !== team.name) onRename(value);
    else setValue(team.name);
  }

  if (editing) {
    return (
      <input
        autoFocus
        className={styles.input}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") {
            setValue(team.name);
            setEditing(false);
          }
        }}
        aria-label="Team name"
      />
    );
  }

  if (!canRename) return <span className={styles.name}>{team.name}</span>;

  return (
    <button
      type="button"
      className={styles.button}
      onClick={() => setEditing(true)}
      title="Rename team"
    >
      {team.name}
      <Pencil size={11} className={styles.pencil} />
    </button>
  );
}
