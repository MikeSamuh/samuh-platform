import BarChart from "@/components/awareness/BarChart";
import Reflections from "@/components/awareness/Reflections";
import AuthorPicker from "@/components/AuthorPicker";
import MediaAccordion from "@/components/MediaAccordion";
import TeamQVisual from "@/components/prepare/TeamQVisual";
import CoachingCard from "@/components/CoachingCard";
import { teamEnvironment, teamPractices } from "@/lib/awarenessData";
import { awarenessMedia } from "@/lib/mediaContent";
import { bookingLinks } from "@/lib/bookingLinks";
import { getAuthors } from "@/lib/authors";
import styles from "./Panel.module.css";

export default function AwarenessPanel({
  members = [],
  currentMemberIndex,
  setCurrentMemberIndex,
  votes = { environment: {}, practices: {} },
  castVote,
  reflections,
  addReflection,
  completeTask,
}) {
  const authors = getAuthors(members);

  return (
    <div className={styles.panel}>
      <TeamQVisual />
      <MediaAccordion
        items={awarenessMedia}
        onItemOpened={(id) => completeTask("awareness", id)}
      />
      <AuthorPicker
        label="Vote as"
        emptyLabel="Add team members on Prepare to vote"
        authors={authors}
        value={currentMemberIndex}
        onChange={setCurrentMemberIndex}
      />
      <BarChart
        title="Team environment"
        rows={teamEnvironment}
        color="var(--chart-pink)"
        authors={authors}
        votes={votes.environment}
        onVote={authors.length ? (label) => castVote("environment", label) : undefined}
      />
      <BarChart
        title="Team practices"
        rows={teamPractices}
        color="var(--chart-teal)"
        authors={authors}
        votes={votes.practices}
        onVote={authors.length ? (label) => castVote("practices", label) : undefined}
      />
      <Reflections
        authors={authors}
        currentAuthorIndex={currentMemberIndex}
        setCurrentAuthorIndex={setCurrentMemberIndex}
        reflections={reflections}
        onAdd={addReflection}
      />
      <CoachingCard href={bookingLinks.coachingCall} />
    </div>
  );
}
