"use client";

import { useRef, useState } from "react";
import { X, Upload, Download } from "lucide-react";
import styles from "./TeamMembers.module.css";

const CSV_TEMPLATE = "Name,Email,Tenure\nJane Doe,jane@example.com,2 years\n";

function parseCsv(text) {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  const rows = [];
  for (const line of lines) {
    const [name, email = "", tenure = ""] = line.split(",").map((c) => c.trim());
    if (!name || name.toLowerCase() === "name") continue;
    rows.push({ name, email, tenure });
  }
  return rows;
}

export default function TeamMembers({ members, onAdd, onRemove }) {
  const fileRef = useRef(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [tenure, setTenure] = useState("");

  function handleAdd() {
    if (!name.trim()) return;
    onAdd({ name: name.trim(), email: email.trim(), tenure: tenure.trim() });
    setName("");
    setEmail("");
    setTenure("");
  }

  function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      parseCsv(String(reader.result)).forEach((row) => onAdd(row));
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  function handleTemplate() {
    const blob = new Blob([CSV_TEMPLATE], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "samuh-team-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>Team members ({members.length})</span>
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
          <span>Name</span>
          <span>Email</span>
          <span>Tenure</span>
          <span />
        </div>
        {members.length === 0 && (
          <div className={styles.empty}>No team members yet — add them below or upload a spreadsheet.</div>
        )}
        {members.map((m) => (
          <div key={m.id} className={styles.row}>
            <span className={styles.name}>{m.name}</span>
            <span className={styles.email}>{m.email || "—"}</span>
            <span className={styles.tenure}>{m.tenure || "—"}</span>
            <button
              type="button"
              className={styles.remove}
              onClick={() => onRemove(m.id)}
              aria-label={`Remove ${m.name}`}
            >
              <X size={13} />
            </button>
          </div>
        ))}
      </div>

      <div className={styles.addRow}>
        <input
          className={styles.input}
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <input
          className={styles.input}
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <input
          className={styles.input}
          placeholder="Tenure"
          value={tenure}
          onChange={(e) => setTenure(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <button type="button" className={styles.addButton} onClick={handleAdd}>
          Add
        </button>
      </div>
    </div>
  );
}
