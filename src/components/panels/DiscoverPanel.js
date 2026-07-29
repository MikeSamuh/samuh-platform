"use client";

import { ClipboardList } from "lucide-react";
import MetaphorCards from "@/components/launch/MetaphorCards";
import CoachingCard from "@/components/CoachingCard";
import { surveyLink } from "@/lib/bookingLinks";
import styles from "./Panel.module.css";

export default function DiscoverPanel({ team, currentMember, completeTask }) {
  return (
    <div className={styles.panel}>
      <div data-tour="metaphor">
        <MetaphorCards
          currentMember={currentMember}
          picks={team.cardPicks}
          onSave={team.saveCardPick}
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
