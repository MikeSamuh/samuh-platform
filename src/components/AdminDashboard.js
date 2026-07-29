"use client";

import { useEffect, useState } from "react";
import { Check, Minus, Users, UserCheck, Play, Flame } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { steps } from "@/lib/steps";
import { stepTasks } from "@/lib/stepTasks";
import { getAuthors } from "@/lib/authors";
import styles from "./AdminDashboard.module.css";

function Mark({ done }) {
  return done ? (
    <Check size={14} className={styles.check} />
  ) : (
    <Minus size={14} className={styles.dash} />
  );
}

function byTeam(rows, key = "team_id") {
  const map = new Map();
  for (const row of rows) {
    if (!map.has(row[key])) map.set(row[key], []);
    map.get(row[key]).push(row);
  }
  return map;
}

export default function AdminDashboard() {
  const [teams, setTeams] = useState(null);

  useEffect(() => {
    let active = true;

    (async () => {
      const [teamRows, members, states, progress, picks, votes, reflections] =
        await Promise.all([
          supabase.from("teams").select("*").order("created_at"),
          supabase.from("members").select("*"),
          supabase.from("team_state").select("*"),
          supabase.from("step_progress").select("*"),
          supabase.from("card_picks").select("*"),
          supabase.from("awareness_votes").select("*"),
          supabase.from("reflections").select("*"),
        ]);

      if (!active) return;

      const membersBy = byTeam(members.data || []);
      const progressBy = byTeam(progress.data || []);
      const picksBy = byTeam(picks.data || []);
      const votesBy = byTeam(votes.data || []);
      const reflectionsBy = byTeam(reflections.data || []);
      const stateBy = new Map((states.data || []).map((s) => [s.team_id, s]));

      setTeams(
        (teamRows.data || []).map((team) => {
          const checks = {};
          for (const row of progressBy.get(team.id) || []) {
            (checks[row.step_id] ||= []).push(row.task_id);
          }
          return {
            ...team,
            members: membersBy.get(team.id) || [],
            state: stateBy.get(team.id) || {},
            checks,
            picks: picksBy.get(team.id) || [],
            votes: votesBy.get(team.id) || [],
            reflections: reflectionsBy.get(team.id) || [],
          };
        })
      );
    })();

    return () => {
      active = false;
    };
  }, []);

  if (!teams) return null;

  return (
    <div className={styles.panel}>
      <span className={styles.eyebrow}>Samuh admin &middot; all client teams</span>

      {teams.length === 0 && (
        <div className={styles.card}>
          <div className={styles.empty}>
            No teams yet. A manager creates one when they sign up.
          </div>
        </div>
      )}

      {teams.map((team) => {
        const authors = getAuthors(team.members);
        const milestones = [
          { id: "members", label: "Members added", icon: Users, done: team.members.length > 0 },
          {
            id: "colead",
            label: "Co-lead identified",
            icon: UserCheck,
            done: Boolean(team.state.co_lead_member_id),
          },
          { id: "launched", label: "TeamQ+ launched", icon: Play, done: Boolean(team.state.launched) },
          {
            id: "keeper",
            label: "Ritual keeper selected",
            icon: Flame,
            done: Boolean(team.state.ritual_keeper_member_id),
          },
        ];

        return (
          <div key={team.id} className={styles.card}>
            <div className={styles.cardTitle}>
              {team.name}
              <span className={styles.teamMeta}>
                {team.members.length} member{team.members.length === 1 ? "" : "s"}
              </span>
            </div>

            {steps.map((step) => {
              const tasks = stepTasks[step.id] || [];
              const checked = team.checks[step.id] || [];
              const done = tasks.filter((t) => checked.includes(t.id)).length;
              const complete = tasks.length > 0 && done === tasks.length;
              return (
                <div key={step.id} className={styles.stepRow}>
                  <span className={styles.stepLabel}>{step.label}</span>
                  <div className={styles.track}>
                    <div
                      className={styles.fill}
                      data-complete={complete}
                      style={{ width: `${tasks.length ? (done / tasks.length) * 100 : 0}%` }}
                    />
                  </div>
                  <span className={styles.stepCount}>
                    {done} / {tasks.length}
                  </span>
                </div>
              );
            })}

            <div className={styles.milestones}>
              {milestones.map(({ id, label, icon: Icon, done }) => (
                <div key={id} className={styles.milestone} data-done={done}>
                  <Icon size={15} className={styles.milestoneIcon} />
                  {label}
                </div>
              ))}
            </div>

            {authors.length > 0 && (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Signed up</th>
                    <th>Card</th>
                    <th>Environment</th>
                    <th>Practices</th>
                    <th>Reflections</th>
                  </tr>
                </thead>
                <tbody>
                  {authors.map((a) => {
                    const row = team.members.find((m) => m.id === a.id);
                    const reflectionCount = team.reflections.filter(
                      (r) => r.member_id === a.id
                    ).length;
                    return (
                      <tr key={a.id}>
                        <td>
                          <span className={styles.memberName} style={{ color: a.color }}>
                            {a.name}
                          </span>
                          {team.state.co_lead_member_id === a.id && (
                            <span className={styles.badge}>Co-lead</span>
                          )}
                          {team.state.ritual_keeper_member_id === a.id && (
                            <span className={styles.badge}>Ritual keeper</span>
                          )}
                        </td>
                        <td>
                          <Mark done={Boolean(row?.user_id)} />
                        </td>
                        <td>
                          <Mark done={team.picks.some((p) => p.member_id === a.id)} />
                        </td>
                        <td>
                          <Mark
                            done={team.votes.some(
                              (v) => v.member_id === a.id && v.chart_id === "environment"
                            )}
                          />
                        </td>
                        <td>
                          <Mark
                            done={team.votes.some(
                              (v) => v.member_id === a.id && v.chart_id === "practices"
                            )}
                          />
                        </td>
                        <td>
                          {reflectionCount > 0 ? reflectionCount : <Mark done={false} />}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        );
      })}
    </div>
  );
}
