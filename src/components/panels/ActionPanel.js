import { Flame } from "lucide-react";
import Worksheet from "@/components/action/Worksheet";
import MediaAccordion from "@/components/MediaAccordion";
import MemberSelectCard from "@/components/MemberSelectCard";
import CoachingCard from "@/components/CoachingCard";
import { actionMedia } from "@/lib/mediaContent";
import { bookingLinks } from "@/lib/bookingLinks";
import styles from "./Panel.module.css";

export default function ActionPanel({
  members,
  currentMemberIndex,
  setCurrentMemberIndex,
  ritualKeeper,
  setRitualKeeper,
  completeTask,
}) {
  return (
    <div className={styles.panel}>
      <Worksheet
        members={members}
        currentMemberIndex={currentMemberIndex}
        setCurrentMemberIndex={setCurrentMemberIndex}
        onNoteAdded={() => completeTask("action", "worksheet")}
      />
      <MediaAccordion
        items={actionMedia}
        onItemOpened={(id) => completeTask("action", id)}
      />
      <MemberSelectCard
        icon={Flame}
        title="Select a ritual keeper"
        sub="The team member who keeps the ritual alive"
        members={members}
        value={ritualKeeper}
        onChange={setRitualKeeper}
      />
      <CoachingCard
        title="Schedule ongoing support"
        sub="Optional — a 90-day sprint or workshop with Samuh"
        buttonLabel="Book time"
        href={bookingLinks.ongoingSupport}
      />
    </div>
  );
}
