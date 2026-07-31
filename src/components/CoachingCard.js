"use client";

import { CalendarClock, Check, ExternalLink } from "lucide-react";
import styles from "./CoachingCard.module.css";

export default function CoachingCard({
  icon: Icon = CalendarClock,
  title = "Schedule a 30-min coaching call with Samuh",
  sub = "Pick a time that works for you",
  missingLinkSub = "Booking link coming soon",
  buttonLabel = "Book a time",
  // Label used when there's no link but the step can still be marked done.
  actionLabel = "Mark as done",
  href,
  onOpen,
  done = false,
}) {
  // Without a link there's nothing to open — but a dead button leaves the task
  // uncompletable, so offer to mark it done instead. Only truly inert when
  // there's neither a link nor an action.
  const isAction = !href && Boolean(onOpen);

  return (
    <div className={styles.card}>
      <div className={styles.info}>
        <span className={styles.iconBox}>
          <Icon size={17} />
        </span>
        <span>
          <div className={styles.title}>{title}</div>
          <div className={styles.sub}>{href ? sub : missingLinkSub}</div>
        </span>
      </div>
      {isAction ? (
        <button
          type="button"
          className={styles.button}
          onClick={onOpen}
          data-disabled={done}
          disabled={done}
        >
          {done ? "Done" : actionLabel}
          {done ? <Check size={13} /> : null}
        </button>
      ) : (
        <a
          className={styles.button}
          href={href || "#"}
          target="_blank"
          rel="noopener noreferrer"
          data-disabled={!href}
          onClick={href ? onOpen : undefined}
        >
          {buttonLabel}
          <ExternalLink size={13} />
        </a>
      )}
    </div>
  );
}
