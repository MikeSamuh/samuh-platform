"use client";

import { Layers } from "lucide-react";
import { CUT_FIELDS, cutsFor } from "@/lib/orgq/roster";
import styles from "./Orgq.module.css";

// Org cuts are derived from the roster, never stored — they're simply the
// distinct values in each column. Everything downstream (completion rates, the
// heat map, the priority matrix) is sliced by these.
export default function OrgCuts({ people }) {
  const groups = CUT_FIELDS.map((f) => ({ ...f, cuts: cutsFor(people, f.key) })).filter(
    (g) => g.cuts.length > 0
  );

  return (
    <div className={styles.card}>
      <div className={styles.head}>
        <span className={styles.iconBox}>
          <Layers size={17} />
        </span>
        <div className={styles.headText}>
          <div className={styles.title}>Your org cuts</div>
          <div className={styles.sub}>
            The slices every result can be broken down by — taken from the roster
          </div>
        </div>
      </div>

      {groups.length === 0 ? (
        <div className={styles.empty}>
          Add people to the roster with a team or manager and your cuts will appear here.
        </div>
      ) : (
        groups.map((g) => (
          <div key={g.key} className={styles.cutGroup}>
            <div className={styles.cutLabel}>
              {g.label} · {g.cuts.length}
            </div>
            <div className={styles.chips}>
              {g.cuts.map((c) => (
                <span key={c.value} className={styles.chip}>
                  {c.value}
                  <span className={styles.chipCount}>{c.count}</span>
                </span>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
