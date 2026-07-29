"use client";

import { useState } from "react";
import { Play, RotateCcw } from "lucide-react";
import MediaAccordion from "@/components/MediaAccordion";
import MetaphorCards from "@/components/launch/MetaphorCards";
import CoachingCard from "@/components/CoachingCard";
import { launchMedia } from "@/lib/mediaContent";
import { bookingLinks } from "@/lib/bookingLinks";
import { getAuthors } from "@/lib/authors";
import panelStyles from "./Panel.module.css";
import styles from "./LaunchPanel.module.css";

export default function LaunchPanel({ team, currentMember, completeTask }) {
  const authors = getAuthors(team.members);
  const [relaunched, setRelaunched] = useState(false);

  return (
    <div className={panelStyles.panel}>
      <div data-tour="media">
        <MediaAccordion
          items={launchMedia}
          onItemOpened={(id) => completeTask("launch", id)}
        />
      </div>

      <div data-tour="launch">
        {team.launched ? (
          <div className={styles.statusRow}>
            <div className={styles.status}>
              TeamQ+ launched &middot; {team.members.length} of {team.members.length} invited, 0
              responded
            </div>
            <button
              type="button"
              className={styles.relaunchButton}
              onClick={async () => {
                await team.relaunchSurvey();
                setRelaunched(true);
                setTimeout(() => setRelaunched(false), 2500);
              }}
            >
              <RotateCcw size={14} />
              {relaunched ? "Survey relaunched" : "Relaunch survey"}
            </button>
          </div>
        ) : (
          <button
            type="button"
            className={styles.launchButton}
            onClick={() => team.setLaunched(true)}
            disabled={team.members.length === 0}
          >
            <Play size={16} />
            Launch TeamQ+
          </button>
        )}
      </div>

      <div data-tour="metaphor">
        <MetaphorCards
          authors={authors}
          currentMember={currentMember}
          picks={team.cardPicks}
          onPick={team.pickCard}
          onDescribe={team.describeCard}
        />
      </div>

      <CoachingCard
        sub="Book on the Samuh teams Google Calendar"
        href={bookingLinks.teamGoogleCalendar}
      />
    </div>
  );
}
