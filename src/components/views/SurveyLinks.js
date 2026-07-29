"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import styles from "./Views.module.css";

// Admin-only: link a survey to each client team. The UI is ready, but
// persisting links needs a database migration (a survey_url column or a
// survey_links table) that requires database admin access.
export default function SurveyLinks() {
  const [teams, setTeams] = useState(null);
  const [drafts, setDrafts] = useState({});

  useEffect(() => {
    let active = true;
    supabase
      .from("teams")
      .select("id, name, created_at")
      .order("created_at")
      .then(({ data }) => {
        if (active) setTeams(data || []);
      });
    return () => {
      active = false;
    };
  }, []);

  if (!teams) return null;

  return (
    <div className={styles.panel}>
      <span className={styles.eyebrow}>Samuh admin &middot; link surveys to teams</span>

      <div className={styles.notice}>
        Saving isn&apos;t wired up yet — storing survey links needs a small database
        migration, which requires a fresh Supabase access token. The rest of this screen
        is ready to connect.
      </div>

      <div className={styles.card}>
        <div className={styles.cardTitle}>Client teams</div>
        <div className={styles.cardSub}>
          Paste the survey URL (TeamQ+, or any external survey) each team should receive.
        </div>
        {teams.length === 0 ? (
          <div className={styles.emptyState}>No teams yet.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: "30%" }}>Team</th>
                <th>Survey link</th>
                <th style={{ width: 90 }} />
              </tr>
            </thead>
            <tbody>
              {teams.map((t) => (
                <tr key={t.id}>
                  <td>{t.name}</td>
                  <td>
                    <input
                      className={styles.input}
                      placeholder="https://…"
                      value={drafts[t.id] || ""}
                      onChange={(e) =>
                        setDrafts((d) => ({ ...d, [t.id]: e.target.value }))
                      }
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      className={styles.disabledButton}
                      disabled
                      title="Needs the database migration described above"
                    >
                      Save
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
