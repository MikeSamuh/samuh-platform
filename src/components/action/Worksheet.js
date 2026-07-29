"use client";

import { useMemo, useRef, useState } from "react";
import { Plus, X, Users, ChevronDown } from "lucide-react";
import { teamPractices } from "@/lib/awarenessData";
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

// Notes are stored with section = "<practice>::<zone>". Notes written before
// canvases were per-practice have a bare zone and belong to the default
// (top-voted) practice.
function parseSection(section) {
  const i = section.indexOf("::");
  if (i === -1) return { practice: null, zone: section };
  return { practice: section.slice(0, i), zone: section.slice(i + 2) };
}

export default function Worksheet({ team, currentMember, authors }) {
  const { notes, votes, canvasPractices } = team;

  // Most-starred team practice seeds the default canvas.
  const topVoted = useMemo(() => {
    const counts = {};
    for (const label of Object.values(votes.practices)) {
      counts[label] = (counts[label] || 0) + 1;
    }
    let best = null;
    for (const row of teamPractices) {
      if (best === null || (counts[row.label] || 0) > (counts[best] || 0)) {
        if (counts[row.label]) best = row.label;
      }
    }
    return best || teamPractices[0].label;
  }, [votes.practices]);

  const allPractices = useMemo(() => {
    const base = teamPractices.map((p) => p.label);
    return [...base, ...canvasPractices.filter((p) => !base.includes(p))];
  }, [canvasPractices]);

  const [selected, setSelected] = useState(null);
  const practice = selected || topVoted;

  const [addingPractice, setAddingPractice] = useState(false);
  const [newPractice, setNewPractice] = useState("");

  const me = currentMember ? authors.find((a) => a.id === currentMember.id) : null;

  const canvasNotes = notes.filter((n) => {
    const parsed = parseSection(n.section);
    return (parsed.practice || topVoted) === practice;
  });

  // Drag state lives outside React's tree manipulation: while dragging, the
  // note renders in a board-level overlay (so it can cross zones freely) and
  // window listeners track the pointer. No DOM re-parenting — that was the
  // source of the crash when moving fresh notes between zones.
  const boardRef = useRef(null);
  const zoneRefs = useRef({});
  const [drag, setDrag] = useState(null);
  const dragRef = useRef(null);

  function zoneAt(clientX, clientY) {
    for (const section of SECTIONS) {
      const rect = zoneRefs.current[section.id]?.getBoundingClientRect();
      if (
        rect &&
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      ) {
        return { id: section.id, rect };
      }
    }
    return null;
  }

  function startDrag(e, note) {
    if (e.button !== 0) return;
    const noteRect = e.currentTarget.getBoundingClientRect();
    const start = {
      id: note.id,
      offsetX: e.clientX - noteRect.left,
      offsetY: e.clientY - noteRect.top,
      clientX: e.clientX,
      clientY: e.clientY,
      zone: parseSection(note.section).zone,
      note,
    };
    dragRef.current = start;
    setDrag(start);

    // Listeners attach synchronously so even the fastest flick is captured;
    // `practice` can't change mid-drag, so the closure is safe.
    function onMove(ev) {
      const current = dragRef.current;
      if (!current) return;
      const target = zoneAt(ev.clientX, ev.clientY);
      const next = {
        ...current,
        clientX: ev.clientX,
        clientY: ev.clientY,
        zone: target ? target.id : current.zone,
      };
      dragRef.current = next;
      setDrag(next);
    }

    function onUp() {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      const current = dragRef.current;
      dragRef.current = null;
      setDrag(null);
      if (!current) return;
      const zoneRect = zoneRefs.current[current.zone]?.getBoundingClientRect();
      if (!zoneRect) return;
      const x = Math.max(
        4,
        Math.min(zoneRect.width - NOTE_WIDTH - 4, current.clientX - zoneRect.left - current.offsetX)
      );
      const y = Math.max(4, current.clientY - zoneRect.top - current.offsetY);
      team.updateNote(current.note.id, {
        section: `${practice}::${current.zone}`,
        x,
        y,
      });
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  function handleAdd() {
    if (!currentMember) return;
    team.addNote({
      section: `${practice}::what`,
      x: 12,
      y: 10 + Math.random() * 40,
      text: "New idea",
      color: me?.color || null,
    });
  }

  async function handleAddPractice() {
    const name = newPractice.trim();
    if (!name) return;
    await team.addCanvasPractice(name);
    setSelected(name);
    setNewPractice("");
    setAddingPractice(false);
  }

  const boardRect = boardRef.current?.getBoundingClientRect();

  function renderNote(note, dragging) {
    const author = authors.find((a) => a.id === note.member_id);
    const color = note.color || author?.color || "var(--text-dim)";
    const parsed = parseSection(note.section);

    const style = dragging
      ? {
          left: drag.clientX - (boardRect?.left || 0) - drag.offsetX,
          top: drag.clientY - (boardRect?.top || 0) - drag.offsetY,
          width: NOTE_WIDTH,
        }
      : { left: note.x, top: note.y, width: NOTE_WIDTH };

    return (
      <div
        key={note.id}
        className={styles.note}
        data-dragging={dragging || undefined}
        style={style}
        onPointerDown={dragging ? undefined : (e) => startDrag(e, { ...note, section: `${parsed.practice || practice}::${parsed.zone}` })}
      >
        <div className={styles.noteHeader}>
          <span className={styles.dot} style={{ background: color }} />
          <span className={styles.noteAuthor}>{author?.name || "—"}</span>
          <button
            type="button"
            className={styles.delete}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => team.removeNote(note.id)}
            aria-label={`Remove note by ${author?.name || "member"}`}
          >
            <X size={12} />
          </button>
        </div>
        <div
          className={styles.text}
          contentEditable={!dragging}
          suppressContentEditableWarning
          onPointerDown={(e) => e.stopPropagation()}
          onBlur={(e) => {
            const next = e.currentTarget.textContent;
            if (next !== note.text) team.updateNote(note.id, { text: next });
          }}
        >
          {note.text}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.worksheet}>
      <div className={styles.header}>
        <span className={styles.eyebrow}>Action &middot; practice canvas</span>
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

      <div className={styles.practiceBar}>
        <div className={styles.practicePicker}>
          <label className={styles.practiceLabel} htmlFor="canvas-practice">
            Practice
          </label>
          <div className={styles.selectWrap}>
            <select
              id="canvas-practice"
              className={styles.practiceSelect}
              value={practice}
              onChange={(e) => setSelected(e.target.value)}
            >
              {allPractices.map((p) => (
                <option key={p} value={p}>
                  {p === topVoted ? `${p} · most stars` : p}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className={styles.selectChevron} />
          </div>
        </div>
        {addingPractice ? (
          <div className={styles.newPracticeRow}>
            <input
              autoFocus
              className={styles.newPracticeInput}
              placeholder="Name the new practice"
              value={newPractice}
              onChange={(e) => setNewPractice(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddPractice();
                if (e.key === "Escape") setAddingPractice(false);
              }}
            />
            <button type="button" className={styles.newPracticeSave} onClick={handleAddPractice}>
              Add
            </button>
          </div>
        ) : (
          <button
            type="button"
            className={styles.newPracticeButton}
            onClick={() => setAddingPractice(true)}
          >
            <Plus size={13} />
            New practice
          </button>
        )}
      </div>

      <div className={styles.board} ref={boardRef}>
        {SECTIONS.map((section) => {
          const zoneNotes = canvasNotes.filter((n) => {
            if (drag?.id === n.id) return false;
            return parseSection(n.section).zone === section.id;
          });
          const Icon = section.icon;
          return (
            <div
              key={section.id}
              className={styles.zone}
              data-zone={section.id}
              data-drop={drag?.zone === section.id || undefined}
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
                {zoneNotes.map((note) => renderNote(note, false))}
              </div>
            </div>
          );
        })}
        {drag && renderNote(drag.note, true)}
      </div>
    </div>
  );
}
