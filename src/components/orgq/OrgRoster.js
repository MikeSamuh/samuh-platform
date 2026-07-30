"use client";

import { useRef, useState } from "react";
import { X, Upload, Download } from "lucide-react";
import { BUILT_IN_CUTS, valueFor } from "@/lib/orgq/roster";
import styles from "./OrgRoster.module.css";

// Deliberately simple: split on commas, match the header to the columns on
// screen. Quoted fields containing commas aren't supported — the template
// doesn't produce them, and anything more needs a real CSV parser.
function parseCsv(text, columns) {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return [];

  const headerCells = lines[0].split(",").map((c) => c.trim().toLowerCase());
  const looksLikeHeader = headerCells[0] === "name";

  // Map each column to its position in the file, falling back to the on-screen
  // order when the file has no header.
  const indexOf = {};
  columns.forEach((col, i) => {
    const found = looksLikeHeader
      ? headerCells.indexOf(col.label.toLowerCase())
      : i;
    indexOf[col.key] = found === -1 ? null : found;
  });

  const rows = [];
  for (const line of lines.slice(looksLikeHeader ? 1 : 0)) {
    const cells = line.split(",").map((c) => c.trim());
    const name = cells[indexOf.name ?? 0] || "";
    if (!name || name.toLowerCase() === "name") continue;

    const row = { name, email: "", team: "", manager: "", tenure: "", extra: {} };
    for (const col of columns) {
      const at = indexOf[col.key];
      const value = at === null || at === undefined ? "" : cells[at] || "";
      if (col.key === "name") continue;
      if (col.custom) row.extra[col.key] = value;
      else row[col.key] = value;
    }
    rows.push(row);
  }
  return rows;
}

// The org roster. Wider than the team roster — team and manager are what make
// the org cuts possible — and it grows extra columns for whatever cuts the org
// has defined for itself. Imports in bulk, since an org roster is hundreds of
// rows rather than a handful.
export default function OrgRoster({ people, cutFields = [], onAddMany, onRemove }) {
  const fileRef = useRef(null);
  const [uploadNote, setUploadNote] = useState(null);

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    ...BUILT_IN_CUTS,
    ...cutFields.map((label) => ({ key: label, label, custom: true })),
  ];

  const blankDraft = Object.fromEntries(columns.map((c) => [c.key, ""]));
  const [draft, setDraft] = useState(blankDraft);

  const gridTemplate = `${columns
    .map((c) => (c.key === "email" ? "1.5fr" : "1.1fr"))
    .join(" ")} 28px`;

  function toRow(values) {
    const row = { name: "", email: "", team: "", manager: "", tenure: "", extra: {} };
    for (const col of columns) {
      if (col.custom) row.extra[col.key] = values[col.key] || "";
      else row[col.key] = values[col.key] || "";
    }
    return row;
  }

  async function handleAdd() {
    if (!draft.name?.trim()) return;
    await onAddMany([toRow(draft)]);
    setDraft(blankDraft);
  }

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const rows = parseCsv(await file.text(), columns);
    if (rows.length === 0) {
      setUploadNote("No rows found — check the file has a Name column.");
      return;
    }
    const added = await onAddMany(rows);
    setUploadNote(
      added === rows.length
        ? `Added ${added} ${added === 1 ? "person" : "people"}.`
        : `Added ${added} of ${rows.length} — the rest were already on the roster.`
    );
  }

  function handleTemplate() {
    const header = columns.map((c) => c.label).join(",");
    const example = columns
      .map((c) =>
        ({
          name: "Jane Doe",
          email: "jane@example.com",
          team: "Commercial Ops",
          manager: "Priya Shah",
          tenure: "2 years",
        })[c.key] || ""
      )
      .join(",");
    const blob = new Blob([`${header}\n${example}\n`], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "samuh-org-roster-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>Org roster ({people.length})</span>
        <div className={styles.csvActions}>
          <button type="button" className={styles.csvButton} onClick={handleTemplate}>
            <Download size={13} />
            Template
          </button>
          <button
            type="button"
            className={styles.csvButton}
            onClick={() => fileRef.current?.click()}
          >
            <Upload size={13} />
            Upload spreadsheet
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".csv,text/csv"
            hidden
            onChange={handleUpload}
          />
        </div>
      </div>

      <div className={styles.rows}>
        <div
          className={`${styles.row} ${styles.headerRow}`}
          style={{ "--cols": gridTemplate }}
        >
          {columns.map((c) => (
            <span key={c.key}>{c.label}</span>
          ))}
          <span />
        </div>
        {people.length === 0 && (
          <div className={styles.empty}>
            No one on the roster yet — upload a spreadsheet or add people below.
          </div>
        )}
        {people.map((p) => (
          <div
            key={p.raw}
            className={styles.row}
            style={{ "--cols": gridTemplate }}
          >
            {columns.map((c) => {
              const value =
                c.key === "name" ? p.name : c.key === "email" ? p.email : valueFor(p, c.key);
              return (
                <span key={c.key} className={c.key === "name" ? styles.name : styles.cell}>
                  {value || "—"}
                </span>
              );
            })}
            <button
              type="button"
              className={styles.remove}
              onClick={() => onRemove(p.raw)}
              aria-label={`Remove ${p.name}`}
            >
              <X size={13} />
            </button>
          </div>
        ))}
      </div>

      <div className={styles.addRow} style={{ "--cols": gridTemplate }}>
        {columns.map((c) => (
          <input
            key={c.key}
            className={styles.input}
            placeholder={c.label}
            type={c.key === "email" ? "email" : "text"}
            value={draft[c.key] || ""}
            onChange={(e) => setDraft((d) => ({ ...d, [c.key]: e.target.value }))}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            aria-label={c.label}
          />
        ))}
        <button
          type="button"
          className={styles.addButton}
          onClick={handleAdd}
          disabled={!draft.name?.trim()}
        >
          Add
        </button>
      </div>

      {uploadNote && <div className={styles.note}>{uploadNote}</div>}

      <div className={styles.note}>
        Every column except name and email becomes a cut you can slice results by.
        Entries are add-and-remove only, so correcting one means removing it and
        adding it again.
      </div>
    </div>
  );
}
