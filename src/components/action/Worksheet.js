"use client";

import { useRef } from "react";
import { Plus, X, Users } from "lucide-react";
import styles from "./Worksheet.module.css";

const SECTIONS = [
  { id: "what", label: "What", area: "what", hint: "What is this practice or ritual?" },
  {
    id: "why",
    label: "Why",
    area: "why",
    hint: "Why this design — what are we solving for, what do we hope to gain?",
  },
  {
    id: "when",
    label: "When",
    area: "when",
    hint: "Frequency, dates, timings, event that triggers it, etc.",
  },
  {
    id: "who",
    label: "Who",
    area: "who",
    icon: Users,
    hint: "Who attends, and who facilitates or owns it.",
  },
  { id: "how", label: "How", area: "how", hint: "Step by step instructions, key elements." },
  { id: "prep", label: "Prep", area: "prep", hint: "How to set it up, what to do before." },
];

const NOTE_WIDTH = 130;

export default function Worksheet({
  authors,
  currentMember,
  notes,
  onAddNote,
  onUpdateNote,
  onRemoveNote,
}) {
  const zoneRefs = useRef({});
  const offsetRef = useRef({ x: 0, y: 0 });

  const me = currentMember ? authors.find((a) => a.id === currentMember.id) : null;

  function authorFor(note) {
    return authors.find((a) => a.id === note.member_id);
  }

  function handleAdd() {
    if (!currentMember) return;
    onAddNote({
      section: "what",
      x: 12,
      y: 10 + Math.random() * 40,
      text: "New idea",
      color: me?.color || null,
    });
  }

  function handlePointerDown(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    offsetRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    e.currentTarget.setPointerCapture(e.pointerId);
    e.currentTarget.dataset.dragging = "true";
    e.currentTarget.style.zIndex = "10";
  }

  function handlePointerMove(e, note) {
    if (e.currentTarget.dataset.dragging !== "true") return;

    let targetId = note.section;
    let targetRect = zoneRefs.current[note.section]?.getBoundingClientRect();

    for (const section of SECTIONS) {
      const rect = zoneRefs.current[section.id]?.getBoundingClientRect();
      if (
        rect &&
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        targetId = section.id;
        targetRect = rect;
        break;
      }
    }
    if (!targetRect) return;

    const x = Math.max(
      4,
      Math.min(targetRect.width - NOTE_WIDTH - 4, e.clientX - targetRect.left - offsetRef.current.x)
    );
    const y = Math.max(4, e.clientY - targetRect.top - offsetRef.current.y);

    // Move locally while dragging; persist once on release.
    const el = e.currentTarget;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.dataset.pendingSection = targetId;
    el.dataset.pendingX = String(x);
    el.dataset.pendingY = String(y);

    const zone = zoneRefs.current[targetId];
    if (zone && el.parentElement !== zone) zone.appendChild(el);
  }

  function handlePointerUp(e, note) {
    const el = e.currentTarget;
    if (el.dataset.dragging !== "true") return;
    el.dataset.dragging = "false";
    el.style.zIndex = "1";

    const section = el.dataset.pendingSection;
    if (!section) return;
    onUpdateNote(note.id, {
      section,
      x: Number(el.dataset.pendingX),
      y: Number(el.dataset.pendingY),
    });
    delete el.dataset.pendingSection;
  }

  return (
    <div className={styles.worksheet}>
      <div className={styles.header}>
        <span className={styles.eyebrow}>Action &middot; collective worksheet</span>
        <div className={styles.headerActions}>
          {me ? (
            <span className={styles.postAsLabel}>
              Posting as <strong style={{ color: me.color }}>{me.name}</strong>
            </span>
          ) : (
            <span className={styles.postAsLabel}>
              Ask your manager to add you to the roster to post
            </span>
          )}
          <button
            type="button"
            className={styles.addButton}
            onClick={handleAdd}
            disabled={!currentMember}
          >
            <Plus size={14} />
            Add note
          </button>
        </div>
      </div>

      <div className={styles.board}>
        {SECTIONS.map((section) => {
          const zoneNotes = notes.filter((n) => n.section === section.id);
          const Icon = section.icon;
          return (
            <div
              key={section.id}
              className={styles.zone}
              data-zone={section.id}
              style={{ gridArea: section.area }}
            >
              <div className={styles.zoneHeader}>
                <span className={styles.zoneLabel}>
                  {Icon && <Icon size={13} className={styles.zoneIcon} />}
                  {section.label}
                </span>
                {zoneNotes.length === 0 && <span className={styles.zoneHint}>{section.hint}</span>}
              </div>
              <div
                className={styles.zoneCanvas}
                ref={(el) => {
                  zoneRefs.current[section.id] = el;
                }}
              >
                {zoneNotes.map((note) => {
                  const author = authorFor(note);
                  const color = note.color || author?.color || "var(--text-dim)";
                  return (
                    <div
                      key={note.id}
                      className={styles.note}
                      style={{ left: note.x, top: note.y, width: NOTE_WIDTH }}
                      onPointerDown={handlePointerDown}
                      onPointerMove={(e) => handlePointerMove(e, note)}
                      onPointerUp={(e) => handlePointerUp(e, note)}
                      onPointerCancel={(e) => handlePointerUp(e, note)}
                    >
                      <div className={styles.noteHeader}>
                        <span className={styles.dot} style={{ background: color }} />
                        <span className={styles.noteAuthor}>{author?.name || "—"}</span>
                        <button
                          type="button"
                          className={styles.delete}
                          onPointerDown={(e) => e.stopPropagation()}
                          onClick={() => onRemoveNote(note.id)}
                          aria-label={`Remove note by ${author?.name || "member"}`}
                        >
                          <X size={12} />
                        </button>
                      </div>
                      <div
                        className={styles.text}
                        style={{ color }}
                        contentEditable
                        suppressContentEditableWarning
                        onPointerDown={(e) => e.stopPropagation()}
                        onBlur={(e) => {
                          const next = e.currentTarget.textContent;
                          if (next !== note.text) onUpdateNote(note.id, { text: next });
                        }}
                      >
                        {note.text}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
