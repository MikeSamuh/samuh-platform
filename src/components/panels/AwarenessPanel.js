"use client";

import BarChart from "@/components/awareness/BarChart";
import Reflections from "@/components/awareness/Reflections";
import MediaAccordion from "@/components/MediaAccordion";
import TeamQVisual from "@/components/prepare/TeamQVisual";
import CoachingCard from "@/components/CoachingCard";
import { teamEnvironment, teamPractices } from "@/lib/awarenessData";
import { awarenessMedia } from "@/lib/mediaContent";
import { bookingLinks } from "@/lib/bookingLinks";
import { getAuthors } from "@/lib/authors";
import styles from "./Panel.module.css";

export default function AwarenessPanel({ team, currentMember, completeTask }) {
  const authors = getAuthors(team.members);

  return (
    <div className={styles.panel}>
      <div data-tour="teamq">
        <TeamQVisual />
      </div>
      <div data-tour="media">
        <MediaAccordion
          items={awarenessMedia}
          onItemOpened={(id) => completeTask("awareness", id)}
        />
      </div>
      <div data-tour="charts" className={styles.panel} style={{ padding: 0 }}>
        <BarChart
          title="Team environment"
          rows={teamEnvironment}
          color="var(--chart-pink)"
          authors={authors}
          votes={team.votes.environment}
          onVote={currentMember ? (label) => team.castVote("environment", label) : undefined}
        />
        <BarChart
          title="Team practices"
          rows={teamPractices}
          color="var(--chart-teal)"
          authors={authors}
          votes={team.votes.practices}
          onVote={currentMember ? (label) => team.castVote("practices", label) : undefined}
        />
      </div>
      <div data-tour="reflections">
        <Reflections
          reflections={team.reflections}
          onAdd={team.addReflection}
          canPost={Boolean(currentMember)}
        />
      </div>
      <CoachingCard href={bookingLinks.coachingCall} />
    </div>
  );
}
