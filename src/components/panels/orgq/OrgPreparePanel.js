"use client";

import { Mail } from "lucide-react";
import MediaAccordion from "@/components/MediaAccordion";
import CoachingCard from "@/components/CoachingCard";
import OrgSetup from "@/components/orgq/OrgSetup";
import OrgRoster from "@/components/orgq/OrgRoster";
import OrgCuts from "@/components/orgq/OrgCuts";
import FeatureNote from "@/components/orgq/FeatureNote";
import { orgqPrepareMedia } from "@/lib/orgq/media";
import panelStyles from "../Panel.module.css";

export default function OrgPreparePanel({ team, completeTask }) {
  return (
    <div className={panelStyles.panel}>
      <div data-tour="media">
        <MediaAccordion
          items={orgqPrepareMedia}
          onItemOpened={(id) => completeTask("orgq-prepare", id)}
        />
      </div>

      <div data-tour="org-setup">
        <OrgSetup
          orgName={team.orgName}
          packageSize={team.packageSize}
          onSaveName={team.setOrgName}
          onSaveSize={team.setPackageSize}
        />
      </div>

      <div data-tour="roster">
        <OrgRoster
          people={team.orgRoster}
          onAddMany={team.addOrgPeople}
          onRemove={team.removeOrgPerson}
        />
      </div>

      <div data-tour="cuts">
        <OrgCuts people={team.orgRoster} />
      </div>

      <CoachingCard
        icon={Mail}
        title="Send the welcome and invite links"
        sub="Everyone on the roster gets an invite email — they sign in with the address you listed"
        missingLinkSub="Invite sending isn't connected yet — no email provider is configured"
        buttonLabel="Send invites"
        href={null}
        onOpen={() => completeTask("orgq-prepare", "invites")}
      />

      <FeatureNote
        title="Data handling"
        points={[
          "GDPR and SOC 2 compliant — your roster and responses stay inside your org's account.",
          "Documentation on exactly what's collected, where it's stored and how long it's kept.",
        ]}
      />
    </div>
  );
}
