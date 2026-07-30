"use client";

import { useState } from "react";
import { Layers, Plus, X, Undo2 } from "lucide-react";
import {
  allCutFields,
  cutsFor,
  hiddenBuiltIns,
  restorableCutValues,
} from "@/lib/orgq/roster";
import styles from "./Orgq.module.css";

const SUGGESTIONS = ["Region", "Division", "Function", "Location", "Level"];

// Two levels here, and they're easy to confuse.
//
// A *cut* is a dimension — Team, Manager, Region. Adding one adds a roster
// column; removing one takes that column and its axis with it.
//
// A *group* is one value inside a cut — Engineering, EMEA. Groups come only
// from the roster: a group exists because somebody is in it. They can be
// removed from reporting, so a typo or a group you don't report on stops
// polluting the charts, and added back — but never invented, which is why the
// add control is a picker over real values rather than a text box.
export default function OrgCuts({
  people,
  cutFields = [],
  hiddenCuts = [],
  hiddenValues = [],
  onAddField,
  onRemoveField,
  onHideCut,
  onRestoreCut,
  onAddValue,
  onRemoveValue,
}) {
  const [draft, setDraft] = useState("");
  // Which value is selected in each cut's add picker.
  const [valueDraft, setValueDraft] = useState({});

  const groups = allCutFields(cutFields, hiddenCuts).map((f) => ({
    ...f,
    cuts: cutsFor(people, f.key, hiddenValues),
    removed: restorableCutValues(people, f.key, hiddenValues),
  }));

  const hiddenFields = hiddenBuiltIns(hiddenCuts);

  const taken = new Set([
    ...groups.map((g) => g.label.toLowerCase()),
    ...hiddenFields.map((h) => h.label.toLowerCase()),
  ]);
  const suggestions = SUGGESTIONS.filter((s) => !taken.has(s.toLowerCase()));

  async function addField(label) {
    const trimmed = label.trim();
    if (!trimmed || taken.has(trimmed.toLowerCase())) return;
    await onAddField(trimmed);
    setDraft("");
  }

  async function addValue(field) {
    const value = valueDraft[field];
    if (!value) return;
    await onAddValue(field, value);
    setValueDraft((d) => ({ ...d, [field]: "" }));
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

      {groups.length === 0 && (
        <div className={styles.empty}>
          No cuts right now. Add one below to start slicing the results.
        </div>
      )}

      {groups.map((g) => (
        <div key={g.key} className={styles.cutGroup}>
          <div className={styles.cutHeader}>
            <span className={styles.cutLabel}>
              {g.label} · {g.cuts.length}
            </span>
            <button
              type="button"
              className={styles.cutRemove}
              onClick={() => (g.custom ? onRemoveField(g.label) : onHideCut(g.key))}
              aria-label={`Remove the ${g.label} cut`}
            >
              <X size={12} />
              Remove cut
            </button>
          </div>

          <div className={styles.chips}>
            {g.cuts.map((c) => (
              <span key={c.value} className={styles.chip}>
                {c.value}
                <span className={styles.chipCount}>{c.count}</span>
                <button
                  type="button"
                  className={styles.chipRemove}
                  onClick={() => onRemoveValue(g.key, c.value)}
                  aria-label={`Remove ${c.value} from ${g.label}`}
                  title={`Remove ${c.value}`}
                >
                  <X size={12} />
                </button>
              </span>
            ))}
            {g.cuts.length === 0 && (
              <span className={styles.sub}>
                Nothing yet — fill in the {g.label} column on the roster and the
                groups will appear here.
              </span>
            )}
          </div>

          {/* Only groups the roster actually contains can be added, so this is
              a picker over removed values rather than a free-text field. */}
          {g.removed.length > 0 && (
            <div className={styles.valueAddRow}>
              <select
                className={styles.select}
                value={valueDraft[g.key] || ""}
                onChange={(e) =>
                  setValueDraft((d) => ({ ...d, [g.key]: e.target.value }))
                }
                aria-label={`Add a group back to ${g.label}`}
              >
                <option value="">Add back a removed {g.label.toLowerCase()}…</option>
                {g.removed.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className={styles.button}
                onClick={() => addValue(g.key)}
                disabled={!valueDraft[g.key]}
              >
                <Undo2 size={12} />
                Add
              </button>
            </div>
          )}
        </div>
      ))}

      {hiddenFields.length > 0 && (
        <div className={styles.cutGroup}>
          <div className={styles.cutLabel}>Removed cuts — put back any time</div>
          <div className={styles.chips}>
            {hiddenFields.map((h) => (
              <button
                key={h.key}
                type="button"
                className={styles.chip}
                onClick={() => onRestoreCut(h.key)}
              >
                <Undo2 size={12} />
                {h.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={styles.cutGroup}>
        <div className={styles.cutLabel}>Add a cut of your own</div>
        <div className={styles.fieldRow}>
          <input
            className={styles.input}
            placeholder="e.g. Region"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addField(draft)}
            aria-label="New cut name"
          />
          <button
            type="button"
            className={styles.button}
            onClick={() => addField(draft)}
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
                onClick={() => addField(s)}
              >
                <Plus size={12} />
                {s}
              </button>
            ))}
          </div>
        )}
        <div className={styles.hint}>
          Removing a cut or a group only changes what you report on — the roster
          keeps every value, so putting either back brings the numbers with it.
        </div>
      </div>
    </div>
  );
}
