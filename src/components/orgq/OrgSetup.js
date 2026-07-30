"use client";

import { useEffect, useState } from "react";
import { Building2 } from "lucide-react";
import styles from "./Orgq.module.css";

// Package tiers are display-only. No payment is taken anywhere in the app —
// Samuh invoices separately — so this records the intended size, nothing more.
function tierFor(size) {
  const n = Number(size);
  if (!n) return null;
  if (n <= 50) return "Starter · up to 50 people";
  if (n <= 250) return "Growth · up to 250 people";
  if (n <= 1000) return "Scale · up to 1,000 people";
  return "Enterprise · 1,000+ people";
}

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

  async function saveSize() {
    const n = Number(size);
    if (!n || n < 1 || String(n) === packageSize) return;
    await onSaveSize(String(n));
    flash("size");
  }

  const tier = tierFor(size);

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
          <input
            className={styles.input}
            type="number"
            min="1"
            placeholder="Number of people"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && saveSize()}
            aria-label="Package size in people"
          />
          <button
            type="button"
            className={styles.button}
            onClick={saveSize}
            disabled={!Number(size) || String(Number(size)) === packageSize}
          >
            Save
          </button>
          {savedField === "size" && <span className={styles.saved}>Saved</span>}
        </div>
        {tier && <div className={styles.hint}>{tier}</div>}
      </div>

      <div className={styles.hint}>
        No payment is taken here — this records the size of the engagement, and Samuh
        invoices separately.
      </div>
    </div>
  );
}
