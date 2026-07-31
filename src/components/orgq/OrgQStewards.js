"use client";

import { useState } from "react";
import { ShieldCheck, X } from "lucide-react";
import styles from "./Orgq.module.css";

// Stewards carry the rollout inside their part of the org. Unlike ritual
// keepers there's no fixed number — a big org needs one per cut.
export default function OrgQStewards({ people, stewards, onAdd, onRemove }) {
  const [selecting, setSelecting] = useState("");

  const chosen = stewards
    .map((raw) => people.find((p) => p.raw === raw))
    .filter(Boolean);
  const available = people.filter((p) => !stewards.includes(p.raw));

  return (
    <div className={styles.card}>
      <div className={styles.head}>
        <span className={styles.iconBox}>
          <ShieldCheck size={17} />
        </span>
        <div className={styles.headText}>
          <div className={styles.title}>OrgQ stewards</div>
          <div className={styles.sub}>
            {chosen.length} selected — one per part of the org works well
          </div>
        </div>
      </div>

      <ul className={styles.guidance}>
        <li>
          Stewards are the local face of the rollout: they answer questions, chase
          completion in their area, and feed problems back to you.
        </li>
        <li>
          Pick people who are <strong>close to the teams</strong>, not just senior — the
          steward has to be someone a team will actually tell the truth to.
        </li>
        <li>Each one gets the readiness kit below before the survey opens.</li>
      </ul>

      <div className={styles.chips} style={{ marginBottom: 12 }}>
        {chosen.map((p) => (
          <span key={p.raw} className={styles.chip}>
            {p.name}
            {p.team && <span className={styles.chipCount}>{p.team}</span>}
            <button
              type="button"
              className={styles.chipRemove}
              onClick={() => onRemove(p.raw)}
              aria-label={`Remove ${p.name} as steward`}
            >
              <X size={12} />
            </button>
          </span>
        ))}
        {chosen.length === 0 && (
          <span className={styles.empty}>No stewards selected yet.</span>
        )}
      </div>

      {people.length === 0 ? (
        <div className={styles.hint}>
          Add your roster on the Prepare step first — stewards are picked from it.
        </div>
      ) : (
        <div className={styles.fieldRow}>
          <select
            className={styles.select}
            value={selecting}
            onChange={(e) => setSelecting(e.target.value)}
            aria-label="Choose a steward"
          >
            <option value="">Choose someone from the roster</option>
            {available.map((p) => (
              <option key={p.raw} value={p.raw}>
                {p.name}
                {p.team ? ` — ${p.team}` : ""}
              </option>
            ))}
          </select>
          <button
            type="button"
            className={styles.button}
            disabled={!selecting}
            onClick={() => {
              onAdd(selecting);
              setSelecting("");
            }}
          >
            Add Steward
          </button>
        </div>
      )}
    </div>
  );
}
