"use client";

import { CalendarClock, ExternalLink } from "lucide-react";
import styles from "./CoachingCard.module.css";

export default function CoachingCard({
  icon: Icon = CalendarClock,
  title = "Schedule a 30-min coaching call with Samuh",
  sub = "Pick a time that works for you",
  missingLinkSub = "Booking link coming soon",
  buttonLabel = "Book a time",
  href,
  onOpen,
}) {
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
    </div>
  );
}
