"use client";

import { Flame } from "lucide-react";
import Worksheet from "@/components/action/Worksheet";
import MediaAccordion from "@/components/MediaAccordion";
import MemberSelectCard from "@/components/MemberSelectCard";
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
        <Worksheet
          authors={authors}
          currentMember={currentMember}
          notes={team.notes}
          onAddNote={team.addNote}
          onUpdateNote={team.updateNote}
          onRemoveNote={team.removeNote}
        />
      </div>
      <div data-tour="media">
        <MediaAccordion
          items={actionMedia}
          onItemOpened={(id) => completeTask("action", id)}
        />
      </div>
      <div data-tour="keeper">
        <MemberSelectCard
          icon={Flame}
          title="Select a ritual keeper"
          sub="The team member who keeps the ritual alive"
          members={team.members}
          value={team.ritualKeeper}
          onChange={team.setRitualKeeper}
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
