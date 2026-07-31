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

// Two levels, and they're easy to confuse.
//
// A *cut* is a dimension — Team, Manager, Region. Adding one adds a roster
// column and an axis you can read results by; that lives in the strip at the
// bottom of this card.
//
// A *group* is one value inside a cut — Engineering, EMEA. Groups come only
// from the roster: a group exists because somebody is in it. The two columns
// are simply which groups you're reporting on and which you aren't; moving one
// across never touches roster data. They're listed flat rather than sectioned
// per cut, so each pill carries its cut name to stay unambiguous.
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

  const fields = allCutFields(cutFields, hiddenCuts);

  const selected = [];
  const available = [];
  for (const field of fields) {
    for (const c of cutsFor(people, field.key, hiddenValues)) {
      selected.push({ field, value: c.value, count: c.count });
    }
    for (const v of restorableCutValues(people, field.key, hiddenValues)) {
      available.push({ field, value: v });
    }
  }

  // Grouped-ish ordering without headings: same cut stays together, biggest
  // groups first inside it.
  const order = (a, b) =>
    a.field.label.localeCompare(b.field.label) ||
    (b.count || 0) - (a.count || 0) ||
    a.value.localeCompare(b.value);
  selected.sort(order);
  available.sort(order);

  const hiddenFields = hiddenBuiltIns(hiddenCuts);
  const taken = new Set([
    ...fields.map((f) => f.label.toLowerCase()),
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
            Everything the results can be broken down by — taken from the roster
          </div>
        </div>
      </div>

      <div className={styles.buckets}>
        <div className={styles.bucket}>
          <div className={styles.bucketLabel}>Selected · {selected.length}</div>
          <div className={styles.chips}>
            {selected.map((item) => (
              <span key={`${item.field.key}::${item.value}`} className={styles.chip}>
                <span className={styles.chipField}>{item.field.label}</span>
                {item.value}
                <span className={styles.chipCount}>{item.count}</span>
                <button
                  type="button"
                  className={styles.chipRemove}
                  onClick={() => onRemoveValue(item.field.key, item.value)}
                  aria-label={`Remove ${item.value} from ${item.field.label}`}
                  title={`Move ${item.value} to available`}
                >
                  <X size={12} />
                </button>
              </span>
            ))}
            {selected.length === 0 && (
              <span className={styles.sub}>
                Nothing selected — pick from the right.
              </span>
            )}
          </div>
        </div>

        <div className={`${styles.bucket} ${styles.bucketOff}`}>
          <div className={styles.bucketLabel}>Available · {available.length}</div>
          <div className={styles.chips}>
            {available.map((item) => (
              <button
                key={`${item.field.key}::${item.value}`}
                type="button"
                className={styles.chip}
                data-off="true"
                onClick={() => onAddValue(item.field.key, item.value)}
                aria-label={`Add ${item.value} back to ${item.field.label}`}
                title={`Move ${item.value} to selected`}
              >
                <Plus size={12} />
                <span className={styles.chipField}>{item.field.label}</span>
                {item.value}
              </button>
            ))}
            {available.length === 0 && (
              <span className={styles.sub}>
                {selected.length === 0
                  ? "Fill in a cut column on the roster and groups will appear here."
                  : "Everything is selected."}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Managing the dimensions themselves, kept apart from choosing groups. */}
      <div className={styles.cutStrip}>
        <div className={styles.bucketLabel}>Cuts</div>
        <div className={styles.chips}>
          {fields.map((f) => (
            <span key={f.key} className={styles.chip}>
              {f.label}
              <button
                type="button"
                className={styles.chipRemove}
                onClick={() => (f.custom ? onRemoveField(f.label) : onHideCut(f.key))}
                aria-label={`Remove the ${f.label} cut`}
                title={`Remove the ${f.label} cut`}
              >
                <X size={12} />
              </button>
            </span>
          ))}
          {hiddenFields.map((h) => (
            <button
              key={h.key}
              type="button"
              className={styles.chip}
              data-off="true"
              onClick={() => onRestoreCut(h.key)}
              aria-label={`Add the ${h.label} cut back`}
              title={`Add the ${h.label} cut back`}
            >
              <Plus size={12} />
              {h.label}
            </button>
          ))}
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              className={styles.chip}
              data-off="true"
              onClick={() => addField(s)}
              title={`Add a ${s} cut`}
            >
              <Plus size={12} />
              {s}
            </button>
          ))}
        </div>
        <div className={styles.fieldRow} style={{ marginTop: 10 }}>
          <input
            className={styles.input}
            placeholder="Add a cut of your own — e.g. Business unit"
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
      </div>

      <div className={styles.hint}>
        Only what&apos;s selected appears in the results. Moving a group between the
        two columns never changes the roster, and a cut is a column on it.
      </div>
    </div>
  );
}
