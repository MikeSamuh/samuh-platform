"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { metaphorCards, parsePickDescription } from "@/lib/metaphorCards";
import styles from "./MetaphorCards.module.css";

// Cards still awaiting illustration show their name hand-lettered on the same
// black card, so the deck is fully usable before the art lands.
function CardArt({ card }) {
  if (card.src) {
    return <img className={styles.art} src={card.src} alt="" draggable={false} />;
  }
  return (
    <span className={styles.artFallback} style={{ "--accent": card.accent }}>
      {card.name}
    </span>
  );
}

// Image-only deck: pick the image that fits, give it your own name, say why,
// and save. Picks surface anonymously in Awareness — no team list here.
export default function MetaphorCards({ currentMember, picks, onSave }) {
  const saved = currentMember ? picks[currentMember.id] : null;
  const savedParsed = saved ? parsePickDescription(saved.description) : null;

  const [cardId, setCardId] = useState(saved?.cardId || null);
  const [name, setName] = useState(savedParsed?.name || "");
  const [why, setWhy] = useState(savedParsed?.why || "");
  const [justSaved, setJustSaved] = useState(false);

  const selectedCard = metaphorCards.find((c) => c.id === cardId);
  const dirty =
    cardId &&
    (cardId !== saved?.cardId ||
      name !== (savedParsed?.name || "") ||
      why !== (savedParsed?.why || ""));

  async function handleSave() {
    if (!currentMember || !cardId) return;
    await onSave(currentMember.id, cardId, name, why);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2200);
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span className={styles.title}>Metaphor cards</span>
        {currentMember && saved && !dirty && (
          <span className={styles.savedBadge}>
            <Check size={13} />
            Saved
          </span>
        )}
      </div>
      <div className={styles.sub}>
        Pick the image that best describes your experience on this team.
      </div>

      <div className={styles.deck}>
        {metaphorCards.map((card) => (
          <button
            key={card.id}
            type="button"
            className={styles.cardButton}
            data-selected={cardId === card.id}
            onClick={() => currentMember && setCardId(card.id)}
            disabled={!currentMember}
            aria-label={card.name}
            title={card.name}
          >
            <CardArt card={card} />
          </button>
        ))}
      </div>

      {selectedCard && (
        <div className={styles.saveArea}>
          <span className={styles.chosenCard}>
            <CardArt card={selectedCard} />
          </span>
          <div className={styles.saveFields}>
            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="card-name">
                Name your card
              </label>
              <input
                id="card-name"
                className={styles.input}
                placeholder="What would you call this?"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="card-why">
                Why did you choose it?
              </label>
              <input
                id="card-why"
                className={styles.input}
                placeholder="A few words is plenty"
                value={why}
                onChange={(e) => setWhy(e.target.value)}
              />
            </div>
            <button
              type="button"
              className={styles.saveButton}
              onClick={handleSave}
              disabled={!dirty && !justSaved}
            >
              {justSaved ? "Saved" : saved ? "Update" : "Save"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
