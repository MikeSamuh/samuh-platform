"use client";

import { useEffect, useState } from "react";
import { Building2 } from "lucide-react";
import styles from "./Orgq.module.css";

// Bands rather than an exact headcount — an org sizing an engagement knows
// roughly how many people it covers, not the precise number. The stored value
// is the label itself, so it stays readable wherever it surfaces.
const PACKAGE_SIZES = [
  "<100",
  "100-500",
  "500-1000",
  "1000-3000",
  "3000-5000",
  "5000-10000",
];

// Org name and package size are single stored values, kept together because
// they're the two facts that define the engagement.
export default function OrgSetup({ orgName, packageSize, onSaveName, onSaveSize }) {
  const [name, setName] = useState(orgName || "");
  const [size, setSize] = useState(packageSize || "");
  const [savedField, setSavedField] = useState(null);

  // Reload replaces the stored values; don't strand a stale draft on screen.
  useEffect(() => setName(orgName || ""), [orgName]);
  useEffect(() => setSize(packageSize || ""), [packageSize]);

  function flash(field) {
    setSavedField(field);
    setTimeout(() => setSavedField((f) => (f === field ? null : f)), 2000);
  }

  async function saveName() {
    if (!name.trim() || name.trim() === orgName) return;
    await onSaveName(name);
    flash("name");
  }

  // The dropdown commits straight away — there's nothing to type, so a Save
  // button would just be an extra click.
  async function selectSize(value) {
    setSize(value);
    if (!value || value === packageSize) return;
    await onSaveSize(value);
    flash("size");
  }

  return (
    <div className={styles.card}>
      <div className={styles.head}>
        <span className={styles.iconBox}>
          <Building2 size={17} />
        </span>
        <div className={styles.headText}>
          <div className={styles.title}>Your organisation</div>
          <div className={styles.sub}>
            How the org is named across reports, and how many people OrgQ covers
          </div>
        </div>
      </div>

      <div className={styles.cutGroup}>
        <div className={styles.cutLabel}>Organisation name</div>
        <div className={styles.fieldRow}>
          <input
            className={styles.input}
            placeholder="e.g. Cencora"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && saveName()}
            aria-label="Organisation name"
          />
          <button
            type="button"
            className={styles.button}
            onClick={saveName}
            disabled={!name.trim() || name.trim() === orgName}
          >
            Save
          </button>
          {savedField === "name" && <span className={styles.saved}>Saved</span>}
        </div>
      </div>

      <div className={styles.cutGroup}>
        <div className={styles.cutLabel}>Package size</div>
        <div className={styles.fieldRow}>
          <select
            className={styles.select}
            value={size}
            onChange={(e) => selectSize(e.target.value)}
            aria-label="Package size"
          >
            <option value="">How many people does OrgQ cover?</option>
            {PACKAGE_SIZES.map((s) => (
              <option key={s} value={s}>
                {s} people
              </option>
            ))}
          </select>
          {savedField === "size" && <span className={styles.saved}>Saved</span>}
        </div>
      </div>

      <div className={styles.hint}>
        No payment is taken here — this records the size of the engagement, and Samuh
        invoices separately.
      </div>
    </div>
  );
}
