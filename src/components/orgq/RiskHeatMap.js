"use client";

import { Grid3x3 } from "lucide-react";
import { primaryCuts } from "@/lib/orgq/roster";
import { bandFor, bandLegend, orgDimensions, seededScore } from "@/lib/orgq/sampleData";
import shared from "./Orgq.module.css";
import styles from "./RiskHeatMap.module.css";

// Every org cut against every dimension. Rows come from the real roster; the
// scores are seeded stand-ins until assessment data exists.
export default function RiskHeatMap({ people }) {
  const { field, cuts } = primaryCuts(people);

  return (
    <div className={shared.card} data-tour="heatmap">
      <div className={shared.head}>
        <span className={shared.iconBox}>
          <Grid3x3 size={17} />
        </span>
        <div className={`${shared.headText} ${shared.headRow}`} style={{ flex: 1 }}>
          <div>
            <div className={shared.title}>High-risk heat map</div>
            <div className={shared.sub}>
              Each {field} against every dimension — warm cells are where the need is
              highest
            </div>
          </div>
          <span className={shared.sampleTag}>Sample data</span>
        </div>
      </div>

      {cuts.length === 0 ? (
        <div className={shared.empty}>
          Add people to the roster with a team or manager and the heat map will fill in.
        </div>
      ) : (
        <>
          <div className={styles.scroller}>
            <div
              className={styles.grid}
              style={{
                gridTemplateColumns: `minmax(120px, max-content) repeat(${orgDimensions.length}, 92px)`,
              }}
            >
              <div className={`${styles.colHead} ${styles.corner}`} />
              {orgDimensions.map((d) => (
                <div key={d} className={styles.colHead}>
                  {d}
                </div>
              ))}

              {cuts.map((cut) => (
                <Row key={cut.value} cut={cut} />
              ))}
            </div>
          </div>

          <div className={styles.legend}>
            {bandLegend.map((b) => (
              <span key={b.label} className={styles.legendItem}>
                <span
                  className={styles.swatch}
                  style={{ background: `var(${b.varName})` }}
                />
                {b.label}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Row({ cut }) {
  return (
    <>
      <div className={styles.rowHead} title={cut.value}>
        {cut.value}
      </div>
      {orgDimensions.map((d) => {
        const score = seededScore(`${cut.value}|${d}`);
        const band = bandFor(score);
        return (
          <div
            key={d}
            className={styles.cell}
            style={{ background: `var(${band.varName})` }}
            title={`${cut.value} · ${d}: ${score} (${band.label})`}
          >
            {score}
          </div>
        );
      })}
    </>
  );
}
