"use client";

import { UserCheck } from "lucide-react";
import MediaAccordion from "@/components/MediaAccordion";
import MemberSelectCard from "@/components/MemberSelectCard";
import TeamMembers from "@/components/prepare/TeamMembers";
import TourCard from "@/components/prepare/TourCard";
import CoachingCard from "@/components/CoachingCard";
import { prepareMedia } from "@/lib/mediaContent";
import { bookingLinks } from "@/lib/bookingLinks";
import styles from "./Panel.module.css";

export default function PreparePanel({
  members,
  addMember,
  removeMember,
  coLead,
  setCoLead,
  completeTask,
  taskChecks = {},
  startTour,
}) {
  return (
    <div className={styles.panel}>
      <div data-tour="media">
        <MediaAccordion
          items={prepareMedia}
          onItemOpened={(id) => completeTask("prepare", id)}
        />
      </div>
      <TourCard
        onStart={startTour}
        completed={(taskChecks.prepare || []).includes("tour")}
      />
      <div data-tour="members">
        <TeamMembers members={members} onAdd={addMember} onRemove={removeMember} />
      </div>
      <div data-tour="colead">
        <MemberSelectCard
          icon={UserCheck}
          title="Identify a co-lead"
          sub="Now that your team is in, pick your co-lead"
          members={members}
          value={coLead}
          onChange={setCoLead}
        />
      </div>
      <CoachingCard href={bookingLinks.coachingCall} />
    </div>
  );
}
