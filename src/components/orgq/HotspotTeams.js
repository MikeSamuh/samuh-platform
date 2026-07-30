"use client";

import { Flame } from "lucide-react";
import { bandFor, cutScore, needsFor } from "@/lib/orgq/sampleData";
import shared from "./Orgq.module.css";

const TOP_N = 6;

// The groups the heat map surfaces first, ranked worst-scoring, with what each
// one most needs. These are the teams to start a journey with.
export default function HotspotTeams({ cuts, cutLabel }) {
  const field = cutLabel.toLowerCase();

  const ranked = cuts
    .map((cut) => ({ name: cut.value, count: cut.count, score: cutScore(cut.value) }))
    .sort((a, b) => a.score - b.score);
  const shown = ranked.slice(0, TOP_N);

  return (
    <div className={shared.card} data-tour="hotspots">
      <div className={shared.head}>
        <span className={shared.iconBox}>
          <Flame size={17} />
        </span>
        <div className={`${shared.headText} ${shared.headRow}`} style={{ flex: 1 }}>
          <div>
            <div className={shared.title}>Hotspots</div>
            <div className={shared.sub}>
              The {field}s with the highest need, and what each one is asking for
            </div>
          </div>
          <span className={shared.sampleTag}>Sample data</span>
        </div>
      </div>

      {shown.length === 0 ? (
        <div className={shared.empty}>
          Fill in the {cutLabel} column on the roster to surface hotspots.
        </div>
      ) : (
        <>
          {shown.map((h) => {
            const band = bandFor(h.score);
            return (
              <div key={h.name} className={shared.cutGroup}>
                <div className={shared.headRow}>
                  <div className={shared.title}>{h.name}</div>
                  <span
                    className={shared.chip}
                    style={{ color: `var(${band.varName})` }}
                    title={`Score ${h.score} · ${band.label}`}
                  >
                    {h.score} · {band.label}
                  </span>
                </div>
                <div className={shared.sub} style={{ margin: "4px 0 7px" }}>
                  {h.count} {h.count === 1 ? "person" : "people"}
                </div>
                <div className={shared.chips}>
                  {needsFor(h.name).map((need) => (
                    <span key={need} className={shared.chip}>
                      {need}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
          {ranked.length > TOP_N && (
            <div className={shared.hint}>
              Showing the {TOP_N} highest-need of {ranked.length} {field}s.
            </div>
          )}
        </>
      )}
    </div>
  );
}
