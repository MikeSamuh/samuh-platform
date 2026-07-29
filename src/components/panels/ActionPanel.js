"use client";

import Worksheet from "@/components/action/Worksheet";
import RitualKeepers from "@/components/action/RitualKeepers";
import MediaAccordion from "@/components/MediaAccordion";
import CoachingCard from "@/components/CoachingCard";
import { actionMedia } from "@/lib/mediaContent";
import { bookingLinks } from "@/lib/bookingLinks";
import { getAuthors } from "@/lib/authors";
import styles from "./Panel.module.css";

export default function ActionPanel({ team, currentMember, completeTask }) {
  const authors = getAuthors(team.members);

  return (
    <div className={styles.panel}>
      <div data-tour="worksheet">
        <Worksheet team={team} currentMember={currentMember} authors={authors} />
      </div>
      <div data-tour="keeper">
        <RitualKeepers
          members={team.members}
          keepers={team.ritualKeepers}
          onAdd={team.addRitualKeeper}
          onRemove={team.removeRitualKeeper}
        />
      </div>
      <div data-tour="media">
        <MediaAccordion
          items={actionMedia}
          onItemOpened={(id) => completeTask("action", id)}
        />
      </div>
      <CoachingCard
        title="Schedule ongoing support"
        sub="Optional — a 90-day sprint or workshop with Samuh"
        buttonLabel="Book time"
        href={bookingLinks.ongoingSupport}
      />
    </div>
  );
}
