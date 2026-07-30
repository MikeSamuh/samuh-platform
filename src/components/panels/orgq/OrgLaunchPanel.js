"use client";

import { Play, CheckCircle2 } from "lucide-react";
import MediaAccordion from "@/components/MediaAccordion";
import OrgQStewards from "@/components/orgq/OrgQStewards";
import CompletionByCut from "@/components/orgq/CompletionByCut";
import { orgqLaunchMedia } from "@/lib/orgq/media";
import panelStyles from "../Panel.module.css";
import styles from "../LaunchPanel.module.css";

export default function OrgLaunchPanel({ team, completeTask }) {
  const launched = team.orgLaunched;
  const rosterSize = team.orgRoster.length;

  return (
    <div className={panelStyles.panel}>
      <div data-tour="media">
        <MediaAccordion
          items={orgqLaunchMedia}
          onItemOpened={(id) => completeTask("orgq-launch", id)}
        />
      </div>

      <div data-tour="stewards">
        <OrgQStewards
          people={team.orgRoster}
          stewards={team.orgStewards}
          onAdd={team.addOrgSteward}
          onRemove={team.removeOrgSteward}
        />
      </div>

      <div data-tour="launch">
        {launched ? (
          <div className={styles.status}>
            <CheckCircle2 size={14} style={{ verticalAlign: "-2px", marginRight: 6 }} />
            OrgQ survey launched &middot; {rosterSize}{" "}
            {rosterSize === 1 ? "person" : "people"} invited
            <div className={styles.launchedAt}>
              Untick &ldquo;Launch the OrgQ survey&rdquo; in the task list to reopen this.
            </div>
          </div>
        ) : (
          <button
            type="button"
            className={styles.launchButton}
            onClick={() => completeTask("orgq-launch", "launch-survey")}
            disabled={rosterSize === 0}
          >
            <Play size={16} />
            {rosterSize === 0 ? "Add your roster first" : "Launch the OrgQ survey"}
          </button>
        )}
      </div>

      <CompletionByCut people={team.orgRoster} launched={launched} />
    </div>
  );
}
