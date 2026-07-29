"use client";

import { ClipboardList } from "lucide-react";
import MetaphorCards from "@/components/launch/MetaphorCards";
import CoachingCard from "@/components/CoachingCard";
import { surveyLink } from "@/lib/bookingLinks";
import { getAuthors } from "@/lib/authors";
import styles from "./Panel.module.css";

export default function DiscoverPanel({ team, currentMember, completeTask }) {
  const authors = getAuthors(team.members);

  return (
    <div className={styles.panel}>
      <div data-tour="metaphor">
        <MetaphorCards
          authors={authors}
          currentMember={currentMember}
          picks={team.cardPicks}
          onPick={team.pickCard}
          onDescribe={team.describeCard}
        />
      </div>
      <div data-tour="survey">
        <CoachingCard
          icon={ClipboardList}
          title="Take the TeamQ+ survey"
          sub="Opens in a new window — about 15 minutes"
          missingLinkSub="Survey link coming soon"
          buttonLabel="Open survey"
          href={surveyLink}
          onOpen={() => completeTask("discover", "survey")}
        />
      </div>
    </div>
  );
}
