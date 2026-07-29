import { CalendarClock, ExternalLink } from "lucide-react";
import styles from "./CoachingCard.module.css";

export default function CoachingCard({
  title = "Schedule a 30-min coaching call with Samuh",
  sub = "Pick a time that works for you",
  buttonLabel = "Book a time",
  href,
}) {
  return (
    <div className={styles.card}>
      <div className={styles.info}>
        <span className={styles.iconBox}>
          <CalendarClock size={17} />
        </span>
        <span>
          <div className={styles.title}>{title}</div>
          <div className={styles.sub}>{href ? sub : "Booking link coming soon"}</div>
        </span>
      </div>
      <a
        className={styles.button}
        href={href || "#"}
        target="_blank"
        rel="noopener noreferrer"
        data-disabled={!href}
      >
        {buttonLabel}
        <ExternalLink size={13} />
      </a>
    </div>
  );
}
