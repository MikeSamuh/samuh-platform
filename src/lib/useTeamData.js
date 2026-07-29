"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { steps } from "@/lib/steps";
import { stepTasks } from "@/lib/stepTasks";

const EMPTY = {
  team: null,
  members: [],
  coLead: null,
  ritualKeeper: null,
  launched: false,
  cardPicks: {},
  votes: { environment: {}, practices: {} },
  reflections: [],
  notes: [],
  taskChecks: {},
};

function groupProgress(rows) {
  const checks = {};
  for (const row of rows) {
    (checks[row.step_id] ||= []).push(row.task_id);
  }
  return checks;
}

function groupVotes(rows) {
  const votes = { environment: {}, practices: {} };
  for (const row of rows) {
    votes[row.chart_id][row.member_id] = row.row_label;
  }
  return votes;
}

function groupPicks(rows) {
  const picks = {};
  for (const row of rows) {
    picks[row.member_id] = { cardId: row.card_id, description: row.description || "" };
  }
  return picks;
}

export function useTeamData(teamId, userId) {
  const [data, setData] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Writes used to fail silently, which made a missing team look like a
  // broken button. Surface anything the database rejects.
  function check({ error: err }, action) {
    if (err) setError(`Couldn't ${action}: ${err.message}`);
    else setError(null);
    return !err;
  }

  const load = useCallback(async () => {
    if (!teamId) {
      setData(EMPTY);
      setLoading(false);
      return;
    }

    const [teamRow, members, teamState, progress, picks, votes, reflections, notes] = await Promise.all([
      supabase.from("teams").select("*").eq("id", teamId).maybeSingle(),
      supabase.from("members").select("*").eq("team_id", teamId).order("created_at"),
      supabase.from("team_state").select("*").eq("team_id", teamId).maybeSingle(),
      supabase.from("step_progress").select("*").eq("team_id", teamId),
      supabase.from("card_picks").select("*").eq("team_id", teamId),
      supabase.from("awareness_votes").select("*").eq("team_id", teamId),
      supabase.from("reflections").select("*").eq("team_id", teamId).order("created_at"),
      supabase.from("notes").select("*").eq("team_id", teamId).order("created_at"),
    ]);

    setData({
      team: teamRow.data || null,
      members: members.data || [],
      coLead: teamState.data?.co_lead_member_id || null,
      ritualKeeper: teamState.data?.ritual_keeper_member_id || null,
      launched: teamState.data?.launched || false,
      cardPicks: groupPicks(picks.data || []),
      votes: groupVotes(votes.data || []),
      reflections: reflections.data || [],
      notes: notes.data || [],
      taskChecks: groupProgress(progress.data || []),
    });
    setLoading(false);
  }, [teamId]);

  useEffect(() => {
    load();
  }, [load]);

  // The signed-in person's roster row — who they act as.
  const currentMember =
    data.members.find((m) => m.user_id === userId) || null;

  async function ensureTeamState(patch) {
    const { data: updated } = await supabase
      .from("team_state")
      .upsert({ team_id: teamId, ...patch }, { onConflict: "team_id" })
      .select()
      .maybeSingle();
    return updated;
  }

  const actions = {
    async renameTeam(name) {
      const trimmed = name.trim();
      if (!trimmed) return;
      setData((d) => ({ ...d, team: { ...d.team, name: trimmed } }));
      await supabase.from("teams").update({ name: trimmed }).eq("id", teamId);
    },

    async addMember({ name, email = "", tenure = "" }) {
      if (!name?.trim()) return;
      const res = await supabase
        .from("members")
        .insert({ team_id: teamId, name: name.trim(), email: email.trim(), tenure: tenure.trim() })
        .select()
        .single();
      if (!check(res, "add that member")) return;
      setData((d) => ({ ...d, members: [...d.members, res.data] }));
      await actions.completeTask("prepare", "members");
    },

    async removeMember(id) {
      await supabase.from("members").delete().eq("id", id);
      setData((d) => {
        const votes = {
          environment: { ...d.votes.environment },
          practices: { ...d.votes.practices },
        };
        delete votes.environment[id];
        delete votes.practices[id];
        const { [id]: _removed, ...cardPicks } = d.cardPicks;
        return {
          ...d,
          members: d.members.filter((m) => m.id !== id),
          coLead: d.coLead === id ? null : d.coLead,
          ritualKeeper: d.ritualKeeper === id ? null : d.ritualKeeper,
          votes,
          cardPicks,
        };
      });
    },

    async setCoLead(memberId) {
      setData((d) => ({ ...d, coLead: memberId }));
      await ensureTeamState({ co_lead_member_id: memberId });
      if (memberId) await actions.completeTask("prepare", "colead");
    },

    async setRitualKeeper(memberId) {
      setData((d) => ({ ...d, ritualKeeper: memberId }));
      await ensureTeamState({ ritual_keeper_member_id: memberId });
      if (memberId) await actions.completeTask("action", "ritual-keeper");
    },

    async setLaunched(value) {
      setData((d) => ({ ...d, launched: value }));
      await ensureTeamState({
        launched: value,
        launched_at: value ? new Date().toISOString() : null,
      });
      if (value) await actions.completeTask("launch", "launch-teamq");
    },

    async pickCard(memberId, cardId) {
      setData((d) => ({
        ...d,
        cardPicks: {
          ...d.cardPicks,
          [memberId]: { cardId, description: d.cardPicks[memberId]?.description || "" },
        },
      }));
      await supabase.from("card_picks").upsert(
        {
          team_id: teamId,
          member_id: memberId,
          card_id: cardId,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "team_id,member_id" }
      );
      await actions.completeTask("launch", "metaphor");
    },

    async describeCard(memberId, description) {
      setData((d) => ({
        ...d,
        cardPicks: { ...d.cardPicks, [memberId]: { ...d.cardPicks[memberId], description } },
      }));
      await supabase
        .from("card_picks")
        .update({ description, updated_at: new Date().toISOString() })
        .eq("team_id", teamId)
        .eq("member_id", memberId);
    },

    async castVote(chartId, rowLabel) {
      if (!currentMember) return;
      const memberId = currentMember.id;
      const existing = data.votes[chartId][memberId];

      if (existing === rowLabel) {
        setData((d) => {
          const chart = { ...d.votes[chartId] };
          delete chart[memberId];
          return { ...d, votes: { ...d.votes, [chartId]: chart } };
        });
        await supabase
          .from("awareness_votes")
          .delete()
          .eq("team_id", teamId)
          .eq("chart_id", chartId)
          .eq("member_id", memberId);
        return;
      }

      setData((d) => ({
        ...d,
        votes: { ...d.votes, [chartId]: { ...d.votes[chartId], [memberId]: rowLabel } },
      }));
      await supabase.from("awareness_votes").upsert(
        { team_id: teamId, member_id: memberId, chart_id: chartId, row_label: rowLabel },
        { onConflict: "team_id,chart_id,member_id" }
      );
      await actions.completeTask("awareness", "vote");
    },

    async addReflection(text) {
      const { data: row } = await supabase
        .from("reflections")
        .insert({ team_id: teamId, member_id: currentMember?.id || null, text })
        .select()
        .single();
      if (row) setData((d) => ({ ...d, reflections: [...d.reflections, row] }));
      await actions.completeTask("awareness", "reflect");
    },

    async addNote({ section, x, y, text, color }) {
      const { data: row } = await supabase
        .from("notes")
        .insert({
          team_id: teamId,
          section,
          x,
          y,
          text,
          color,
          member_id: currentMember?.id || null,
        })
        .select()
        .single();
      if (row) setData((d) => ({ ...d, notes: [...d.notes, row] }));
      await actions.completeTask("action", "worksheet");
    },

    async updateNote(id, patch) {
      setData((d) => ({
        ...d,
        notes: d.notes.map((n) => (n.id === id ? { ...n, ...patch } : n)),
      }));
      await supabase
        .from("notes")
        .update({ ...patch, updated_at: new Date().toISOString() })
        .eq("id", id);
    },

    async removeNote(id) {
      setData((d) => ({ ...d, notes: d.notes.filter((n) => n.id !== id) }));
      await supabase.from("notes").delete().eq("id", id);
    },

    async completeTask(stepId, taskId) {
      if ((data.taskChecks[stepId] || []).includes(taskId)) return;
      setData((d) => {
        const current = d.taskChecks[stepId] || [];
        if (current.includes(taskId)) return d;
        return { ...d, taskChecks: { ...d.taskChecks, [stepId]: [...current, taskId] } };
      });
      await supabase
        .from("step_progress")
        .upsert(
          { team_id: teamId, step_id: stepId, task_id: taskId },
          { onConflict: "team_id,step_id,task_id" }
        );
    },

    async uncompleteTask(stepId, taskId) {
      setData((d) => ({
        ...d,
        taskChecks: {
          ...d.taskChecks,
          [stepId]: (d.taskChecks[stepId] || []).filter((id) => id !== taskId),
        },
      }));
      await supabase
        .from("step_progress")
        .delete()
        .eq("team_id", teamId)
        .eq("step_id", stepId)
        .eq("task_id", taskId);
    },
  };

  function isStepComplete(stepId, checks = data.taskChecks) {
    const tasks = stepTasks[stepId] || [];
    const checked = checks[stepId] || [];
    return tasks.length > 0 && tasks.every((t) => checked.includes(t.id));
  }

  let unlockedIndex = steps.length - 1;
  for (let i = 0; i < steps.length; i++) {
    if (!isStepComplete(steps[i].id)) {
      unlockedIndex = i;
      break;
    }
  }

  return {
    ...data,
    loading,
    error,
    dismissError: () => setError(null),
    currentMember,
    unlockedIndex,
    isStepComplete,
    reload: load,
    ...actions,
  };
}
