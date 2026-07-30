"use client";

import { useState } from "react";
import { Layers, X } from "lucide-react";
import { allCutFields, cutsFor } from "@/lib/orgq/roster";
import styles from "./Orgq.module.css";

const SUGGESTIONS = ["Region", "Division", "Function", "Location", "Level"];

// Cuts are derived from the roster, never stored — they're the distinct values
// in each column. Team, manager and tenure come as standard; everything else is
// whatever the org says it's structured by, and adding one adds a roster column.
export default function OrgCuts({ people, cutFields = [], onAddField, onRemoveField }) {
  const [draft, setDraft] = useState("");

  const groups = allCutFields(cutFields).map((f) => ({
    ...f,
    cuts: cutsFor(people, f.key),
  }));

  const taken = new Set(
    groups.map((g) => g.label.toLowerCase())
  );
  const suggestions = SUGGESTIONS.filter((s) => !taken.has(s.toLowerCase()));

  async function add(label) {
    const trimmed = label.trim();
    if (!trimmed || taken.has(trimmed.toLowerCase())) return;
    await onAddField(trimmed);
    setDraft("");
  }

  return (
    <div className={styles.card}>
      <div className={styles.head}>
        <span className={styles.iconBox}>
          <Layers size={17} />
        </span>
        <div className={styles.headText}>
          <div className={styles.title}>Your org cuts</div>
          <div className={styles.sub}>
            The slices every result can be broken down by — taken from the roster
          </div>
        </div>
      </div>

      {groups.map((g) => (
        <div key={g.key} className={styles.cutGroup}>
          <div className={styles.cutLabel}>
            <span>
              {g.label} · {g.cuts.length}
            </span>
            {g.custom && (
              <button
                type="button"
                className={styles.chipRemove}
                onClick={() => onRemoveField(g.label)}
                aria-label={`Remove the ${g.label} cut`}
                title={`Remove the ${g.label} cut`}
              >
                <X size={12} />
              </button>
            )}
          </div>
          {g.cuts.length === 0 ? (
            <div className={styles.sub}>
              Nothing yet — fill in the {g.label} column on the roster.
            </div>
          ) : (
            <div className={styles.chips}>
              {g.cuts.map((c) => (
                <span key={c.value} className={styles.chip}>
                  {c.value}
                  <span className={styles.chipCount}>{c.count}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      ))}

      <div className={styles.cutGroup}>
        <div className={styles.cutLabel}>Add a cut of your own</div>
        <div className={styles.fieldRow}>
          <input
            className={styles.input}
            placeholder="e.g. Region"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add(draft)}
            aria-label="New cut name"
          />
          <button
            type="button"
            className={styles.button}
            onClick={() => add(draft)}
            disabled={!draft.trim() || taken.has(draft.trim().toLowerCase())}
          >
            Add cut
          </button>
        </div>
        {suggestions.length > 0 && (
          <div className={styles.chips} style={{ marginTop: 10 }}>
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                className={styles.chip}
                onClick={() => add(s)}
              >
                + {s}
              </button>
            ))}
          </div>
        )}
        <div className={styles.hint}>
          Each cut becomes a column on the roster and an axis you can read the
          results by.
        </div>
      </div>
    </div>
  );
}
