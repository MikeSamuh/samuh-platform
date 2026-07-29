"use client";

import { metaphorCards } from "@/lib/metaphorCards";
import AuthorPicker from "@/components/AuthorPicker";
import styles from "./MetaphorCards.module.css";

export default function MetaphorCards({
  authors,
  currentAuthorIndex,
  setCurrentAuthorIndex,
  picks,
  onPick,
  onDescribe,
}) {
  const author = authors[Math.min(currentAuthorIndex, authors.length - 1)] || null;
  const myPick = author ? picks[author.id] : null;

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span className={styles.title}>Metaphor cards</span>
        <AuthorPicker
          label="Choosing as"
          emptyLabel="Add team members on Prepare first"
          authors={authors}
          value={currentAuthorIndex}
          onChange={setCurrentAuthorIndex}
        />
      </div>
      <div className={styles.sub}>
        Pick the card that best describes your experience on this team, then say why.
      </div>

      <div className={styles.deck}>
        {metaphorCards.map((card) => (
          <button
            key={card.id}
            type="button"
            className={styles.cardButton}
            data-selected={myPick?.cardId === card.id}
            onClick={() => author && onPick(author.id, card.id)}
            disabled={!author}
          >
            <span className={styles.emoji}>{card.emoji}</span>
            <span className={styles.cardName}>{card.name}</span>
            <span className={styles.blurb}>{card.blurb}</span>
          </button>
        ))}
      </div>

      {myPick && (
        <div className={styles.describe}>
          <label className={styles.describeLabel} htmlFor="card-desc">
            Why does this card fit, {author.name}?
          </label>
          <textarea
            id="card-desc"
            className={styles.textarea}
            placeholder="Describe the card you chose…"
            value={myPick.description || ""}
            onChange={(e) => onDescribe(author.id, e.target.value)}
          />
        </div>
      )}

      {Object.keys(picks).length > 0 && (
        <div className={styles.picks}>
          <span className={styles.picksTitle}>Team picks</span>
          {authors
            .filter((a) => picks[a.id])
            .map((a) => {
              const card = metaphorCards.find((c) => c.id === picks[a.id].cardId);
              if (!card) return null;
              return (
                <div key={a.id} className={styles.pick}>
                  <span className={styles.pickEmoji}>{card.emoji}</span>
                  <span>
                    <span className={styles.pickName} style={{ color: a.color }}>
                      {a.name}
                    </span>{" "}
                    <span className={styles.pickCard}>— {card.name}</span>
                    {picks[a.id].description && (
                      <div className={styles.pickDesc}>“{picks[a.id].description}”</div>
                    )}
                  </span>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
