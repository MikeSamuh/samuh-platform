"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { metaphorCards } from "@/lib/metaphorCards";
import styles from "./TeamMetaphors.module.css";

// The cards chosen on Launch, shown anonymously as a large card deck the team
// scrolls through together — one card per member.
const TINTS = [
  "rgba(74, 158, 255, 0.14)",
  "rgba(214, 64, 154, 0.13)",
  "rgba(95, 180, 122, 0.13)",
  "rgba(232, 138, 42, 0.12)",
  "rgba(127, 119, 221, 0.14)",
  "rgba(58, 149, 172, 0.14)",
];

export default function TeamMetaphors({ authors, picks }) {
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);

  const entries = authors
    .filter((a) => picks[a.id])
    .map((a) => ({
      key: a.id,
      card: metaphorCards.find((c) => c.id === picks[a.id].cardId),
      description: picks[a.id].description,
    }))
    .filter((e) => e.card);

  if (entries.length === 0) return null;

  function scrollToCard(i) {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(entries.length - 1, i));
    const card = track.children[clamped];
    if (card) {
      track.scrollTo({
        left: card.offsetLeft - (track.clientWidth - card.clientWidth) / 2,
        behavior: "smooth",
      });
    }
    setIndex(clamped);
  }

  function handleScroll() {
    const track = trackRef.current;
    if (!track) return;
    const center = track.scrollLeft + track.clientWidth / 2;
    let nearest = 0;
    let nearestDist = Infinity;
    [...track.children].forEach((card, i) => {
      const cardCenter = card.offsetLeft + card.clientWidth / 2;
      const dist = Math.abs(cardCenter - center);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = i;
      }
    });
    setIndex(nearest);
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div>
          <div className={styles.title}>Your team in metaphors</div>
          <div className={styles.sub}>
            One card per person, shared anonymously — scroll through the deck and read
            each one aloud before you look at the numbers.
          </div>
        </div>
        <div className={styles.nav}>
          <span className={styles.counter}>
            {index + 1} / {entries.length}
          </span>
          <button
            type="button"
            className={styles.arrow}
            onClick={() => scrollToCard(index - 1)}
            disabled={index === 0}
            aria-label="Previous card"
          >
            <ChevronLeft size={17} />
          </button>
          <button
            type="button"
            className={styles.arrow}
            onClick={() => scrollToCard(index + 1)}
            disabled={index === entries.length - 1}
            aria-label="Next card"
          >
            <ChevronRight size={17} />
          </button>
        </div>
      </div>

      <div className={styles.track} ref={trackRef} onScroll={handleScroll}>
        {entries.map(({ key, card, description }, i) => (
          <div
            key={key}
            className={styles.bigCard}
            data-focused={i === index}
            style={{ "--tint": TINTS[i % TINTS.length] }}
            onClick={() => scrollToCard(i)}
          >
            <span className={styles.emoji}>{card.emoji}</span>
            <div className={styles.cardName}>{card.name}</div>
            <div className={styles.blurb}>{card.blurb}</div>
            {description && <div className={styles.quote}>“{description}”</div>}
          </div>
        ))}
      </div>

      <div className={styles.dots}>
        {entries.map((e, i) => (
          <button
            key={e.key}
            type="button"
            className={styles.dot}
            data-active={i === index}
            onClick={() => scrollToCard(i)}
            aria-label={`Card ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
