"use client";

import { metaphorCards } from "@/lib/metaphorCards";
import styles from "./TeamMetaphors.module.css";

// Surfaces the metaphor cards everyone chose on Launch — a qualitative
// companion to the quantitative TeamQ readout above it.
export default function TeamMetaphors({ authors, picks }) {
  const entries = authors
    .filter((a) => picks[a.id])
    .map((a) => ({
      author: a,
      card: metaphorCards.find((c) => c.id === picks[a.id].cardId),
      description: picks[a.id].description,
    }))
    .filter((e) => e.card);

  if (entries.length === 0) return null;

  return (
    <div className={styles.wrap}>
      <div className={styles.title}>Your team in metaphors</div>
      <div className={styles.sub}>
        How each person described their experience of the team on Launch — worth reading
        aloud before you look at the numbers below.
      </div>
      <div className={styles.grid}>
        {entries.map(({ author, card, description }) => (
          <div key={author.id} className={styles.entry}>
            <div className={styles.entryHead}>
              <span className={styles.emoji}>{card.emoji}</span>
              <span>
                <div className={styles.cardName}>{card.name}</div>
                <div className={styles.authorName} style={{ color: author.color }}>
                  {author.name}
                </div>
              </span>
            </div>
            {description && <div className={styles.quote}>“{description}”</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
