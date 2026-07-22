"use client";

import { useRef, useState } from "react";
import { Plus, X, Users } from "lucide-react";
import { getAuthors } from "@/lib/authors";
import AuthorPicker from "@/components/AuthorPicker";
import styles from "./Worksheet.module.css";

const SECTIONS = [
  {
    id: "what",
    label: "What",
    area: "what",
    hint: "What is this practice or ritual?",
  },
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
  {
    id: "how",
    label: "How",
    area: "how",
    hint: "Step by step instructions, key elements.",
  },
  {
    id: "prep",
    label: "Prep",
    area: "prep",
    hint: "How to set it up, what to do before.",
  },
];

const NOTE_WIDTH = 130;

function seedNotes(authors) {
  if (authors.length === 0) return [];
  const pick = (i) => authors[i % authors.length];
  return [
    {
      id: "seed-what",
      section: "what",
      text: "Friday retro — 15 min, whole team",
      x: 12,
      y: 10,
      author: pick(0).name,
      color: pick(0).color,
    },
    {
      id: "seed-why",
      section: "why",
      text: "Keep decisions visible before they're forgotten",
      x: 12,
      y: 10,
      author: pick(1).name,
      color: pick(1).color,
    },
    {
      id: "seed-when",
      section: "when",
      text: "Every Friday, 4pm — triggered by sprint close",
      x: 12,
      y: 10,
      author: pick(2).name,
      color: pick(2).color,
    },
  ];
}

export default function Worksheet({ members, currentMemberIndex, setCurrentMemberIndex }) {
  const zoneRefs = useRef({});
  const offsetRef = useRef({ x: 0, y: 0 });

  const authors = getAuthors(members);
  const [notes, setNotes] = useState(() => seedNotes(authors));

  const author = authors[Math.min(currentMemberIndex, authors.length - 1)] || null;

  function handleAddNote() {
    if (!author) return;
    const id = `note-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setNotes((prev) => [
      ...prev,
      {
        id,
        section: "what",
        text: "New idea",
        x: 12,
        y: 10 + Math.random() * 40,
        author: author.name,
        color: author.color,
      },
    ]);
  }

  function removeNote(id) {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  }

  function commitText(id, text) {
    setNotes((prev) => prev.map((note) => (note.id === id ? { ...note, text } : note)));
  }

  function handleNotePointerDown(e, note) {
    const rect = e.currentTarget.getBoundingClientRect();
    offsetRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    e.currentTarget.setPointerCapture(e.pointerId);
    e.currentTarget.dataset.dragging = "true";
    e.currentTarget.style.zIndex = "10";
  }

  function handleNotePointerMove(e, note) {
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

    setNotes((prev) =>
      prev.map((n) => (n.id === note.id ? { ...n, section: targetId, x, y } : n))
    );
  }

  function handleNotePointerUp(e) {
    e.currentTarget.dataset.dragging = "false";
    e.currentTarget.style.zIndex = "1";
  }

  return (
    <div className={styles.worksheet}>
      <div className={styles.header}>
        <span className={styles.eyebrow}>Action &middot; collective worksheet</span>
        <div className={styles.headerActions}>
          <AuthorPicker
            label="Post as"
            emptyLabel="Add team members on Discovery to post notes"
            authors={authors}
            value={currentMemberIndex}
            onChange={setCurrentMemberIndex}
          />
          <button
            type="button"
            className={styles.addButton}
            onClick={handleAddNote}
            disabled={!author}
          >
            <Plus size={14} />
            Add note
          </button>
        </div>
      </div>

      <div className={styles.board}>
        {SECTIONS.map((section) => {
          const zoneNotes = notes.filter((note) => note.section === section.id);
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
                {zoneNotes.map((note) => (
                  <div
                    key={note.id}
                    className={styles.note}
                    style={{ left: note.x, top: note.y, width: NOTE_WIDTH }}
                    onPointerDown={(e) => handleNotePointerDown(e, note)}
                    onPointerMove={(e) => handleNotePointerMove(e, note)}
                    onPointerUp={handleNotePointerUp}
                    onPointerCancel={handleNotePointerUp}
                  >
                    <div className={styles.noteHeader}>
                      <span className={styles.dot} style={{ background: note.color }} />
                      <span className={styles.noteAuthor}>{note.author}</span>
                      <button
                        type="button"
                        className={styles.delete}
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={() => removeNote(note.id)}
                        aria-label={`Remove note by ${note.author}`}
                      >
                        <X size={12} />
                      </button>
                    </div>
                    <div
                      className={styles.text}
                      style={{ color: note.color }}
                      contentEditable
                      suppressContentEditableWarning
                      onPointerDown={(e) => e.stopPropagation()}
                      onBlur={(e) => commitText(note.id, e.currentTarget.textContent)}
                    >
                      {note.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
