"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import styles from "./TeamNameCard.module.css";

export default function TeamNameCard({ team, onRename }) {
  const [value, setValue] = useState(team?.name || "");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setValue(team?.name || "");
  }, [team?.name]);

  if (!team) return null;

  const dirty = value.trim() && value.trim() !== team.name;

  function save() {
    if (!dirty) return;
    onRename(value);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className={styles.card}>
      <div className={styles.head}>
        <span className={styles.iconBox}>
          <Users size={17} />
        </span>
        <div>
          <label className={styles.title} htmlFor="team-name-field">
            Team name
          </label>
          <div className={styles.sub}>What this team is called across the platform</div>
        </div>
      </div>
      <div className={styles.row}>
        <input
          id="team-name-field"
          className={styles.input}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && save()}
          placeholder="e.g. Platform Engineering"
        />
        <button type="button" className={styles.save} onClick={save} disabled={!dirty}>
          {saved ? "Saved" : "Save"}
        </button>
      </div>
    </div>
  );
}
