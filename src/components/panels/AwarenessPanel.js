import BarChart from "@/components/awareness/BarChart";
import Instructions from "@/components/Instructions";
import AuthorPicker from "@/components/AuthorPicker";
import { teamEnvironment, teamPractices } from "@/lib/awarenessData";
import { getAuthors } from "@/lib/authors";
import styles from "./Panel.module.css";

const instructions = `
1. Join peer-to-peer support.
2. Communicate your results with your team.
3. Understand your results.
`;

export default function AwarenessPanel({
  members = [],
  currentMemberIndex,
  setCurrentMemberIndex,
  votes = { environment: {}, practices: {} },
  castVote,
}) {
  const authors = getAuthors(members);

  return (
    <div className={styles.panel}>
      <AuthorPicker
        label="Vote as"
        emptyLabel="Add team members on Discovery to vote"
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
      <Instructions markdown={instructions} />
    </div>
  );
}
