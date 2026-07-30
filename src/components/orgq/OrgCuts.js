"use client";

import { useState } from "react";
import { Layers, Plus, X } from "lucide-react";
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

          {/* Every group in the cut as one pill. Included ones carry their
              count and an X; excluded ones are dimmed and click to come back.
              Nothing to type, and the full set is visible at a glance. */}
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
            {g.removed.map((v) => (
              <button
                key={v}
                type="button"
                className={styles.chip}
                data-off="true"
                onClick={() => onAddValue(g.key, v)}
                aria-label={`Add ${v} back to ${g.label}`}
                title={`Add ${v} back`}
              >
                <Plus size={12} />
                {v}
              </button>
            ))}
            {g.cuts.length === 0 && g.removed.length === 0 && (
              <span className={styles.sub}>
                Nothing yet — fill in the {g.label} column on the roster and the
                groups will appear here.
              </span>
            )}
          </div>
        </div>
      ))}

      {hiddenFields.length > 0 && (
        <div className={styles.cutGroup}>
          <div className={styles.cutLabel}>Removed cuts</div>
          <div className={styles.chips}>
            {hiddenFields.map((h) => (
              <button
                key={h.key}
                type="button"
                className={styles.chip}
                data-off="true"
                onClick={() => onRestoreCut(h.key)}
                aria-label={`Add the ${h.label} cut back`}
                title={`Add ${h.label} back`}
              >
                <Plus size={12} />
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
          Click a pill&apos;s × to leave a group out of your reporting, or a dimmed
          pill to bring it back. The roster keeps every value either way.
        </div>
      </div>
    </div>
  );
}
