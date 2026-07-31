"use client";

import { GitCompareArrows } from "lucide-react";
import BarChart from "@/components/awareness/BarChart";
import { orgDimensions, seededScore } from "@/lib/orgq/sampleData";
import shared from "./Orgq.module.css";

// Team-level scores against the org-wide picture, so you can see what actually
// shifted over the cycle and where teams outran the org.
export default function BenchmarkCompare() {
  const orgRows = orgDimensions.map((d) => ({
    label: d,
    value: seededScore(`org|${d}`, 40, 88),
  }));
  const teamRows = orgDimensions.map((d) => ({
    label: d,
    value: seededScore(`team|${d}`, 45, 95),
  }));

  return (
    <div className={shared.card} data-tour="benchmark">
      <div className={shared.head}>
        <span className={shared.iconBox}>
          <GitCompareArrows size={17} />
        </span>
        <div className={`${shared.headText} ${shared.headRow}`} style={{ flex: 1 }}>
          <div>
            <div className={shared.title}>TeamQ against OrgQ</div>
            <div className={shared.sub}>
              Where the teams that ran a journey ended up, against the org baseline
            </div>
          </div>
          <span className={shared.sampleTag}>Sample data</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <BarChart
          title="OrgQ — org-wide baseline"
          rows={orgRows}
          color="var(--chart-pink)"
          max={100}
        />
        <BarChart
          title="TeamQ — teams that ran a journey"
          rows={teamRows}
          color="var(--chart-teal)"
          max={100}
        />
      </div>
    </div>
  );
}
