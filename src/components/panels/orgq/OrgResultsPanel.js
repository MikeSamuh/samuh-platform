"use client";

import { useMemo, useState } from "react";
import MediaAccordion from "@/components/MediaAccordion";
import TeamQVisual from "@/components/prepare/TeamQVisual";
import CutSelector from "@/components/orgq/CutSelector";
import RiskHeatMap from "@/components/orgq/RiskHeatMap";
import HotspotTeams from "@/components/orgq/HotspotTeams";
import ValueMatrix from "@/components/orgq/ValueMatrix";
import { cutsFor, populatedCutFields } from "@/lib/orgq/roster";
import { orgqResultsMedia } from "@/lib/orgq/media";
import panelStyles from "../Panel.module.css";

export default function OrgResultsPanel({ team, completeTask }) {
  const [chosenCut, setChosenCut] = useState(null);

  // Only offer axes that have data behind them.
  const cutOpts = {
    fields: team.orgCutFields,
    hiddenFields: team.orgHiddenCuts,
    declared: team.orgCutValues,
    hiddenValues: team.orgHiddenValues,
  };

  const fields = useMemo(
    () => populatedCutFields(team.orgRoster, cutOpts),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [team.orgRoster, team.orgCutFields, team.orgHiddenCuts, team.orgCutValues, team.orgHiddenValues]
  );

  // A chosen cut can stop being valid when the roster changes under it.
  const active =
    fields.find((f) => f.key === chosenCut) || fields[0] || { key: "team", label: "Team" };

  // Resolved once here so the three visuals below are guaranteed to be reading
  // the same groups — they're stacked and will be compared against each other.
  const cuts = cutsFor(
    team.orgRoster,
    active.key,
    team.orgCutValues,
    team.orgHiddenValues
  );

  return (
    <div className={panelStyles.panel}>
      <div data-tour="score">
        <TeamQVisual wordmark="OrgQ" score="68.4" capacity="96" loss="-19%" lossSub="(4.2/22)" />
      </div>

      <CutSelector fields={fields} value={active.key} onChange={setChosenCut} />

      <RiskHeatMap cuts={cuts} cutLabel={active.label} />

      <HotspotTeams cuts={cuts} cutLabel={active.label} />

      <ValueMatrix cuts={cuts} cutLabel={active.label} />

      <div data-tour="media">
        <MediaAccordion
          items={orgqResultsMedia}
          onItemOpened={(id) => completeTask("orgq-results", id)}
        />
      </div>
    </div>
  );
}
