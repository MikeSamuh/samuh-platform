"use client";

import MediaAccordion from "@/components/MediaAccordion";
import TeamQVisual from "@/components/prepare/TeamQVisual";
import RiskHeatMap from "@/components/orgq/RiskHeatMap";
import HotspotTeams from "@/components/orgq/HotspotTeams";
import ValueMatrix from "@/components/orgq/ValueMatrix";
import FeatureNote from "@/components/orgq/FeatureNote";
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

      <FeatureNote
        title="Who sees what"
        points={[
          "Each team and org cut sees its own results — leaders see their area, the C-suite sees the whole org.",
          "The heat map flags high-risk groups alongside what they need, so the readout comes with a next step.",
          "The priority matrix sequences the work: highest need against highest value.",
        ]}
      />
    </div>
  );
}
