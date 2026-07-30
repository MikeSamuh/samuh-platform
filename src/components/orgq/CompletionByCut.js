"use client";

import { Activity } from "lucide-react";
import BarChart from "@/components/awareness/BarChart";
import { primaryCuts } from "@/lib/orgq/roster";
import { seededScore } from "@/lib/orgq/sampleData";
// Launch has no axis picker — it just reads by whichever cut is populated.
import shared from "./Orgq.module.css";

// Response rates while the survey is open, so you can see which parts of the
// org need chasing. Rows are real cuts; the rates are stand-ins.
export default function CompletionByCut({
  people,
  cutFields = [],
  hiddenCuts = [],
  cutValues = [],
  hiddenValues = [],
  launched,
}) {
  const { field, cuts } = primaryCuts(people, {
    fields: cutFields,
    hiddenFields: hiddenCuts,
    declared: cutValues,
    hiddenValues,
  });

  const rows = cuts.map((cut) => ({
    label: cut.value,
    value: launched ? seededScore(`${cut.value}|done`, 22, 98) : 0,
  }));

  const overall = rows.length
    ? Math.round(rows.reduce((sum, r) => sum + r.value, 0) / rows.length)
    : 0;

  return (
    <div className={shared.card} data-tour="monitor">
      <div className={shared.head}>
        <span className={shared.iconBox}>
          <Activity size={17} />
        </span>
        <div className={`${shared.headText} ${shared.headRow}`} style={{ flex: 1 }}>
          <div>
            <div className={shared.title}>Completion progress</div>
            <div className={shared.sub}>
              {launched
                ? `${overall}% across the org — broken down by ${field}`
                : "Launch the survey to start tracking responses"}
            </div>
          </div>
          {launched && <span className={shared.sampleTag}>Sample data</span>}
        </div>
      </div>

      {rows.length === 0 ? (
        <div className={shared.empty}>
          Fill in a cut column on the roster to track completion by group.
        </div>
      ) : !launched ? (
        <div className={shared.empty}>
          Nothing to report yet — responses appear here once the survey is launched.
        </div>
      ) : (
        <BarChart
          title={`Response rate by ${field}`}
          rows={rows}
          color="var(--chart-teal)"
          max={100}
          suffix="%"
        />
      )}
    </div>
  );
}
