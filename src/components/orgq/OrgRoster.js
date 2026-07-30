"use client";

import { useRef, useState } from "react";
import { X, Upload, Download } from "lucide-react";
import styles from "./OrgRoster.module.css";

const COLUMNS = ["Name", "Email", "Team", "Manager", "Tenure"];

const CSV_TEMPLATE =
  "Name,Email,Team,Manager,Tenure\n" +
  "Jane Doe,jane@example.com,Commercial Ops,Priya Shah,2 years\n";

// Deliberately simple: split on commas, skip a header row. Quoted fields
// containing commas aren't supported — the template doesn't produce them, and
// anything more needs a real CSV parser.
function parseCsv(text) {
  const rows = [];
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const [name, email = "", team = "", manager = "", tenure = ""] = trimmed
      .split(",")
      .map((c) => c.trim());
    if (!name || name.toLowerCase() === "name") continue;
    rows.push({ name, email, team, manager, tenure });
  }
  return rows;
}

// The org roster. Wider than the team roster — team and manager are what make
// the org cuts possible — and it uploads in bulk, since an org roster is
// hundreds of rows rather than a handful.
export default function OrgRoster({ people, onAddMany, onRemove }) {
  const fileRef = useRef(null);
  const [draft, setDraft] = useState({
    name: "",
    email: "",
    team: "",
    manager: "",
    tenure: "",
  });
  const [uploadNote, setUploadNote] = useState(null);

  const set = (key) => (e) => setDraft((d) => ({ ...d, [key]: e.target.value }));

  async function handleAdd() {
    if (!draft.name.trim()) return;
    await onAddMany([draft]);
    setDraft({ name: "", email: "", team: "", manager: "", tenure: "" });
  }

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const text = await file.text();
    const rows = parseCsv(text);
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
    const blob = new Blob([CSV_TEMPLATE], { type: "text/csv" });
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
        <div className={`${styles.row} ${styles.headerRow}`}>
          {COLUMNS.map((c) => (
            <span key={c}>{c}</span>
          ))}
          <span />
        </div>
        {people.length === 0 && (
          <div className={styles.empty}>
            No one on the roster yet — upload a spreadsheet or add people below.
          </div>
        )}
        {people.map((p) => (
          <div key={p.raw} className={styles.row}>
            <span className={styles.name}>{p.name}</span>
            <span className={styles.cell}>{p.email || "—"}</span>
            <span className={styles.cell}>{p.team || "—"}</span>
            <span className={styles.cell}>{p.manager || "—"}</span>
            <span className={styles.cell}>{p.tenure || "—"}</span>
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

      <div className={styles.addRow}>
        {["name", "email", "team", "manager", "tenure"].map((key, i) => (
          <input
            key={key}
            className={styles.input}
            placeholder={COLUMNS[i]}
            type={key === "email" ? "email" : "text"}
            value={draft[key]}
            onChange={set(key)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            aria-label={COLUMNS[i]}
          />
        ))}
        <button
          type="button"
          className={styles.addButton}
          onClick={handleAdd}
          disabled={!draft.name.trim()}
        >
          Add
        </button>
      </div>

      {uploadNote && <div className={styles.note}>{uploadNote}</div>}

      <div className={styles.note}>
        Team and manager are what make the org cuts work — results can be sliced by
        either. Entries are add-and-remove only, so correcting one means removing it
        and adding it again.
      </div>
    </div>
  );
}
