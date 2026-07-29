"use client";

import { UserCheck } from "lucide-react";
import MediaAccordion from "@/components/MediaAccordion";
import MemberSelectCard from "@/components/MemberSelectCard";
import TeamMembers from "@/components/prepare/TeamMembers";
import TeamNameCard from "@/components/prepare/TeamNameCard";
import CoachingCard from "@/components/CoachingCard";
import { prepareMedia } from "@/lib/mediaContent";
import { bookingLinks } from "@/lib/bookingLinks";
import styles from "./Panel.module.css";

export default function PreparePanel({ team, completeTask, canManage }) {
  return (
    <div className={styles.panel}>
      {canManage && (
        <div data-tour="team-name">
          <TeamNameCard team={team.team} onRename={team.renameTeam} />
        </div>
      )}
      <div data-tour="media">
        <MediaAccordion
          items={prepareMedia}
          onItemOpened={(id) => completeTask("prepare", id)}
        />
      </div>
      <div data-tour="members">
        <TeamMembers
          members={team.members}
          onAdd={team.addMember}
          onRemove={team.removeMember}
        />
      </div>
      <div data-tour="colead">
        <MemberSelectCard
          icon={UserCheck}
          title="Identify a co-lead"
          sub="Now that your team is in, pick your co-lead"
          members={team.members}
          value={team.coLead}
          onChange={team.setCoLead}
        />
      </div>
      <CoachingCard href={bookingLinks.coachingCall} />
    </div>
  );
}
