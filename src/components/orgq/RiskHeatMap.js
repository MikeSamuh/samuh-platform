"use client";

import { Grid3x3 } from "lucide-react";
import { bandFor, bandLegend, orgDimensions, seededScore } from "@/lib/orgq/sampleData";
import shared from "./Orgq.module.css";
import styles from "./RiskHeatMap.module.css";

const MIN_DOT = 7;
const MAX_DOT = 26;
// Below this a cell is doing badly enough to call out.
const FLAG_BELOW = 52;

// Dot size carries the level of need, so the biggest marks are the biggest
// problems; colour carries the band, so the two reinforce each other. Rows are
// whichever cut of the org you're reading by.
function dotSize(score) {
  const need = (100 - score) / 100;
  return Math.round(MIN_DOT + need * (MAX_DOT - MIN_DOT));
}

export default function RiskHeatMap({ cuts, cutLabel }) {

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
              Each {cutLabel.toLowerCase()} against every dimension — bigger, warmer
              dots are where the need is highest
            </div>
          </div>
          <span className={shared.sampleTag}>Sample data</span>
        </div>
      </div>

      {cuts.length === 0 ? (
        <div className={shared.empty}>
          Fill in the {cutLabel} column on the roster and the heat map will fill in.
        </div>
      ) : (
        <>
          <div className={styles.scroller}>
            <div
              className={styles.grid}
              style={{
                gridTemplateColumns: `minmax(110px, max-content) repeat(${orgDimensions.length}, 88px)`,
              }}
            >
              <div className={styles.corner} />
              {orgDimensions.map((d) => (
                <div key={d} className={styles.colHead}>
                  {d}
                </div>
              ))}

              {cuts.map((cut) => (
                <Row key={cut.value} name={cut.value} />
              ))}
            </div>
          </div>

          <div className={styles.legend}>
            <span className={styles.legendItem}>
              <span
                className={styles.legendDot}
                style={{ width: MIN_DOT, height: MIN_DOT }}
              />
              <span
                className={styles.legendDot}
                style={{ width: MAX_DOT, height: MAX_DOT }}
              />
              <span className={styles.legendNote}>smaller = doing well, larger = higher need</span>
            </span>
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

function Row({ name }) {
  return (
    <>
      <div className={styles.rowHead} title={name}>
        {name}
      </div>
      {orgDimensions.map((d, i) => {
        const score = seededScore(`${name}|${d}`);
        const band = bandFor(score);
        const size = dotSize(score);
        return (
          <div key={d} className={styles.cell} data-first={i === 0}>
            <span
              className={styles.dot}
              data-flagged={score < FLAG_BELOW}
              style={{
                width: size,
                height: size,
                background: `var(${band.varName})`,
              }}
              title={`${name} · ${d}: ${score} (${band.label})`}
            />
          </div>
        );
      })}
    </>
  );
}
