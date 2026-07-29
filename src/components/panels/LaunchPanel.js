"use client";

import { Play } from "lucide-react";
import MediaAccordion from "@/components/MediaAccordion";
import MetaphorCards from "@/components/launch/MetaphorCards";
import CoachingCard from "@/components/CoachingCard";
import { launchMedia } from "@/lib/mediaContent";
import { bookingLinks } from "@/lib/bookingLinks";
import { getAuthors } from "@/lib/authors";
import panelStyles from "./Panel.module.css";
import styles from "./LaunchPanel.module.css";

export default function LaunchPanel({
  members = [],
  launched,
  setLaunched,
  currentMemberIndex,
  setCurrentMemberIndex,
  cardPicks,
  pickCard,
  describeCard,
  completeTask,
}) {
  const authors = getAuthors(members);

  return (
    <div className={panelStyles.panel}>
      <MediaAccordion
        items={launchMedia}
        onItemOpened={(id) => completeTask("launch", id)}
      />

      {launched ? (
        <div className={styles.status}>
          TeamQ+ launched &middot; {members.length} of {members.length} invited, 0 responded
        </div>
      ) : (
        <button
          type="button"
          className={styles.launchButton}
          onClick={() => setLaunched(true)}
          disabled={members.length === 0}
        >
          <Play size={16} />
          Launch TeamQ+
        </button>
      )}

      <MetaphorCards
        authors={authors}
        currentAuthorIndex={currentMemberIndex}
        setCurrentAuthorIndex={setCurrentMemberIndex}
        picks={cardPicks}
        onPick={pickCard}
        onDescribe={describeCard}
      />

      <CoachingCard
        sub="Book on the Samuh teams Google Calendar"
        href={bookingLinks.teamGoogleCalendar}
      />
    </div>
  );
}
