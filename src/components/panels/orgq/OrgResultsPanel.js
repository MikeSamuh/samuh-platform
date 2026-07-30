"use client";

import MediaAccordion from "@/components/MediaAccordion";
import TeamQVisual from "@/components/prepare/TeamQVisual";
import RiskHeatMap from "@/components/orgq/RiskHeatMap";
import HotspotTeams from "@/components/orgq/HotspotTeams";
import ValueMatrix from "@/components/orgq/ValueMatrix";
import { orgqResultsMedia } from "@/lib/orgq/media";
import panelStyles from "../Panel.module.css";

export default function OrgResultsPanel({ team, completeTask }) {
  return (
    <div className={panelStyles.panel}>
      <div data-tour="score">
        <TeamQVisual wordmark="OrgQ" score="68.4" capacity="96" loss="-19%" lossSub="(4.2/22)" />
      </div>

      <RiskHeatMap people={team.orgRoster} />

      <HotspotTeams people={team.orgRoster} />

      <ValueMatrix people={team.orgRoster} />

      <div data-tour="media">
        <MediaAccordion
          items={orgqResultsMedia}
          onItemOpened={(id) => completeTask("orgq-results", id)}
        />
      </div>
    </div>
  );
}
