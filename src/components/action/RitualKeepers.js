"use client";

import { useState } from "react";
import { Flame, X } from "lucide-react";
import styles from "./RitualKeepers.module.css";

const KEEPER_COUNT = 2;

export default function RitualKeepers({ members, keepers, onAdd, onRemove }) {
  const [selecting, setSelecting] = useState("");

  const keeperMembers = keepers
    .map((id) => members.find((m) => m.id === id))
    .filter(Boolean);
  const available = members.filter((m) => !keepers.includes(m.id));
  const full = keeperMembers.length >= KEEPER_COUNT;

  return (
    <div className={styles.card}>
      <div className={styles.head}>
        <span className={styles.iconBox}>
          <Flame size={17} />
        </span>
        <div>
          <div className={styles.title}>Select your two ritual keepers</div>
          <div className={styles.sub}>
            {keeperMembers.length} of {KEEPER_COUNT} selected
          </div>
        </div>
      </div>

      <ul className={styles.guidance}>
        <li>
          Ritual keepers gently hold the routine — they make sure the practice actually
          happens, notice when it drifts, and bring the team back to it.
        </li>
        <li>
          Choose people the team trusts and who show up consistently — not necessarily the
          manager. Two keepers share the load and keep each other honest.
        </li>
        <li>
          It&apos;s a <strong>rotating three-month role</strong>: after three months, the
          team picks the next pair so the ritual belongs to everyone over time.
        </li>
      </ul>

      <div className={styles.pills}>
        {keeperMembers.map((m) => (
          <span key={m.id} className={styles.pill}>
            <Flame size={12} className={styles.pillFlame} />
            {m.name}
            <button
              type="button"
              className={styles.pillRemove}
              onClick={() => onRemove(m.id)}
              aria-label={`Remove ${m.name} as ritual keeper`}
            >
              <X size={12} />
            </button>
          </span>
        ))}
        {keeperMembers.length === 0 && (
          <span className={styles.empty}>No keepers selected yet.</span>
        )}
      </div>

      {full ? (
        <div className={styles.fullNote}>
          Two keepers selected — exactly right. Remove one to swap in someone else.
        </div>
      ) : (
        <div className={styles.addRow}>
          <select
            className={styles.select}
            value={selecting}
            onChange={(e) => setSelecting(e.target.value)}
          >
            <option value="">Choose a team member</option>
            {available.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            className={styles.addButton}
            disabled={!selecting}
            onClick={() => {
              onAdd(selecting);
              setSelecting("");
            }}
          >
            Add Ritual Keeper
          </button>
        </div>
      )}
    </div>
  );
}
