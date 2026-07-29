import MediaAccordion from "@/components/MediaAccordion";
import CoachingCard from "@/components/CoachingCard";
import { belongingMedia } from "@/lib/mediaContent";
import { bookingLinks } from "@/lib/bookingLinks";
import styles from "./Panel.module.css";

export default function BelongingPanel({ completeTask }) {
  return (
    <div className={styles.panel}>
      <MediaAccordion
        items={belongingMedia}
        onItemOpened={(id) => completeTask("belonging", id)}
      />
      <CoachingCard
        title="Schedule an in-person workshop or coaching session"
        sub="Optional — a workshop for the whole team, or a 30-min Samuh coaching session"
        href={bookingLinks.workshop}
      />
    </div>
  );
}
