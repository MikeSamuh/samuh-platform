"use client";

import { useState } from "react";
import { MEMBER_COLORS } from "@/lib/colors";
import styles from "./Reflections.module.css";

const STOPWORDS = new Set(
  "a an and are as at be but by for from has have i in is it its of on or our so that the their them they this to was we with you your".split(
    " "
  )
);

function buildCloud(reflections) {
  const counts = new Map();
  for (const r of reflections) {
    for (const raw of r.text.toLowerCase().split(/[^a-z']+/)) {
      const word = raw.replace(/^'+|'+$/g, "");
      if (word.length < 3 || STOPWORDS.has(word)) continue;
      counts.set(word, (counts.get(word) || 0) + 1);
    }
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 40);
}

export default function Reflections({ reflections, onAdd, canPost }) {
  const [text, setText] = useState("");
  const cloud = buildCloud(reflections);
  const maxCount = cloud.length ? cloud[0][1] : 1;

  function handlePost() {
    const trimmed = text.trim();
    if (!trimmed || !canPost) return;
    onAdd(trimmed);
    setText("");
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span className={styles.title}>Notes &amp; reflections</span>
      </div>
      <div className={styles.sub}>
        Share notes or feedback from your sessions — reflections are anonymous, and
        everyone&apos;s words build the cloud.
      </div>

      <div className={styles.inputRow}>
        <textarea
          className={styles.textarea}
          placeholder="What surfaced for you?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={!canPost}
          rows={4}
        />
        <button
          type="button"
          className={styles.postButton}
          onClick={handlePost}
          disabled={!canPost || !text.trim()}
        >
          Post
        </button>
      </div>

      <div className={styles.cloud}>
        {cloud.length === 0 ? (
          <span className={styles.cloudEmpty}>The word cloud appears as reflections come in.</span>
        ) : (
          cloud.map(([word, count], i) => (
            <span
              key={word}
              className={styles.cloudWord}
              style={{
                fontSize: `${20 + (count / maxCount) * 26}px`,
                color: MEMBER_COLORS[i % MEMBER_COLORS.length],
                opacity: 0.55 + (count / maxCount) * 0.45,
              }}
            >
              {word}
            </span>
          ))
        )}
      </div>

      {reflections.length > 0 && (
        <div className={styles.notes}>
          <span className={styles.notesTitle}>All reflections ({reflections.length})</span>
          {reflections.map((r) => (
            <div key={r.id} className={styles.note}>
              <span className={styles.noteText}>{r.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
