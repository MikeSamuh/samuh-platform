"use client";

import { Mail } from "lucide-react";
import MediaAccordion from "@/components/MediaAccordion";
import CoachingCard from "@/components/CoachingCard";
import OrgSetup from "@/components/orgq/OrgSetup";
import OrgRoster from "@/components/orgq/OrgRoster";
import OrgCuts from "@/components/orgq/OrgCuts";
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
          cutFields={team.orgCutFields}
          hiddenCuts={team.orgHiddenCuts}
          onAddMany={team.addOrgPeople}
          onRemove={team.removeOrgPerson}
        />
      </div>

      <div data-tour="cuts">
        <OrgCuts
          people={team.orgRoster}
          cutFields={team.orgCutFields}
          hiddenCuts={team.orgHiddenCuts}
          cutValues={team.orgCutValues}
          hiddenValues={team.orgHiddenValues}
          onAddField={team.addOrgCutField}
          onRemoveField={team.removeOrgCutField}
          onHideCut={team.hideOrgCut}
          onRestoreCut={team.restoreOrgCut}
          onAddValue={team.addOrgCutValue}
          onRemoveValue={team.removeOrgCutValue}
          onRestoreValue={team.restoreOrgCutValue}
        />
      </div>

      <CoachingCard
        icon={Mail}
        title="Send the welcome and invite links"
        sub="Everyone on the roster gets an invite email — they sign in with the address you listed"
        missingLinkSub="No email provider is connected yet — send the invites from your own mail client for now"
        buttonLabel="Send invites"
        actionLabel="Mark invites as sent"
        href={null}
        done={(team.taskChecks["orgq-prepare"] || []).includes("invites")}
        onOpen={() => completeTask("orgq-prepare", "invites")}
      />
    </div>
  );
}
