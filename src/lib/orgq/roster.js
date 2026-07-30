// The org roster has no table of its own — no schema change was available — so
// each person is stored as one step_progress row under the reserved
// "orgq-roster" step id, with the encoded record as the task_id.
//
// That makes the encoded string the row's primary key, so FIELD ORDER MUST
// NEVER CHANGE and keys must stay short and stable. Reordering would orphan
// every existing row. It also means records are add/remove only — fixing a typo
// is a delete plus a re-add, same as the team roster today.

export function encodePerson({
  name,
  email = "",
  team = "",
  manager = "",
  tenure = "",
}) {
  return JSON.stringify({
    n: name.trim(),
    e: email.trim(),
    t: team.trim(),
    m: manager.trim(),
    u: tenure.trim(),
  });
}

export function decodePerson(raw) {
  try {
    const p = JSON.parse(raw);
    return {
      raw,
      name: p.n || "",
      email: p.e || "",
      team: p.t || "",
      manager: p.m || "",
      tenure: p.u || "",
    };
  } catch {
    // Anything stored before this encoding was a bare name.
    return { raw, name: raw, email: "", team: "", manager: "", tenure: "" };
  }
}

// Org cuts are derived, never stored — they are just the distinct values in a
// roster column. This is what "slice the results by team / manager / tenure"
// means in practice.
export const CUT_FIELDS = [
  { key: "team", label: "Team" },
  { key: "manager", label: "Manager" },
  { key: "tenure", label: "Tenure" },
];

export function cutsFor(people, field) {
  const counts = new Map();
  for (const p of people) {
    const value = p[field]?.trim();
    if (!value) continue;
    counts.set(value, (counts.get(value) || 0) + 1);
  }
  return [...counts.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
}

// The rows most of the org-level visuals hang off. Teams are the natural unit;
// fall back to manager, then tenure, so a partially-filled roster still shows
// something meaningful.
export function primaryCuts(people) {
  for (const { key } of CUT_FIELDS) {
    const cuts = cutsFor(people, key);
    if (cuts.length > 0) return { field: key, cuts };
  }
  return { field: "team", cuts: [] };
}
