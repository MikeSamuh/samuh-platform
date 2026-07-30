"use client";

import { useState } from "react";
import { Layers, Plus, X, Undo2 } from "lucide-react";
import {
  allCutFields,
  cutsFor,
  hiddenBuiltIns,
  hiddenCutValues,
} from "@/lib/orgq/roster";
import styles from "./Orgq.module.css";

const SUGGESTIONS = ["Region", "Division", "Function", "Location", "Level"];

// Two levels here, and they're easy to confuse.
//
// A *cut* is a dimension — Team, Manager, Region. Adding one adds a roster
// column; removing one takes that column and its axis with it.
//
// A *group* is one value inside a cut — Engineering, EMEA. Groups normally come
// straight from the roster, but they can also be declared up front so the org
// structure can exist before the roster catches up, and removed individually so
// a typo or a group you don't report on stops polluting the charts. Neither
// action ever edits roster data.
export default function OrgCuts({
  people,
  cutFields = [],
  hiddenCuts = [],
  cutValues = [],
  hiddenValues = [],
  onAddField,
  onRemoveField,
  onHideCut,
  onRestoreCut,
  onAddValue,
  onRemoveValue,
  onRestoreValue,
}) {
  const [draft, setDraft] = useState("");
  // Which cut's "add a group" box is open, and what's typed in it.
  const [valueDraft, setValueDraft] = useState({});

  const groups = allCutFields(cutFields, hiddenCuts).map((f) => ({
    ...f,
    cuts: cutsFor(people, f.key, cutValues, hiddenValues),
    removed: hiddenCutValues(f.key, hiddenValues),
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
    const value = (valueDraft[field] || "").trim();
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
                Nothing yet — add a group below, or fill in the {g.label} column on
                the roster.
              </span>
            )}
          </div>

          {g.removed.length > 0 && (
            <div className={styles.removedRow}>
              <span className={styles.removedLabel}>Removed</span>
              {g.removed.map((v) => (
                <button
                  key={v}
                  type="button"
                  className={styles.chip}
                  onClick={() => onRestoreValue(g.key, v)}
                  title={`Put ${v} back`}
                >
                  <Undo2 size={12} />
                  {v}
                </button>
              ))}
            </div>
          )}

          <div className={styles.valueAddRow}>
            <input
              className={styles.input}
              placeholder={`Add a ${g.label.toLowerCase()}…`}
              value={valueDraft[g.key] || ""}
              onChange={(e) =>
                setValueDraft((d) => ({ ...d, [g.key]: e.target.value }))
              }
              onKeyDown={(e) => e.key === "Enter" && addValue(g.key)}
              aria-label={`Add a group to ${g.label}`}
            />
            <button
              type="button"
              className={styles.button}
              onClick={() => addValue(g.key)}
              disabled={!(valueDraft[g.key] || "").trim()}
            >
              Add
            </button>
          </div>
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
