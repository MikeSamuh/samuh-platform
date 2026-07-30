// The org roster has no table of its own — no schema change was available — so
// each person is stored as one step_progress row under the reserved
// "orgq-roster" step id, with the encoded record as the task_id.
//
// That makes the encoded string the row's primary key, so FIELD ORDER MUST
// NEVER CHANGE and keys must stay short and stable. Reordering would orphan
// every existing row. It also means records are add/remove only — fixing a typo
// is a delete plus a re-add, same as the team roster today.
//
// `x` carries the org's own cut fields (Region, Division, whatever they define).
// It is omitted entirely when empty, so people added before custom cuts existed
// keep byte-identical keys, and its own keys are sorted so the same person
// always encodes the same way regardless of input order.

export function encodePerson({
  name,
  email = "",
  team = "",
  manager = "",
  tenure = "",
  extra = {},
}) {
  const base = {
    n: name.trim(),
    e: email.trim(),
    t: team.trim(),
    m: manager.trim(),
    u: tenure.trim(),
  };

  const cleaned = {};
  for (const key of Object.keys(extra).sort()) {
    const value = String(extra[key] ?? "").trim();
    if (value) cleaned[key] = value;
  }

  return JSON.stringify(
    Object.keys(cleaned).length ? { ...base, x: cleaned } : base
  );
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
      extra: p.x || {},
    };
  } catch {
    // Anything stored before this encoding was a bare name.
    return { raw, name: raw, email: "", team: "", manager: "", tenure: "", extra: {} };
  }
}

// Cuts every org has by default. Anything else the org defines for itself.
export const BUILT_IN_CUTS = [
  { key: "team", label: "Team" },
  { key: "manager", label: "Manager" },
  { key: "tenure", label: "Tenure" },
];

const BUILT_IN_KEYS = BUILT_IN_CUTS.map((c) => c.key);

export function isBuiltInCut(key) {
  return BUILT_IN_KEYS.includes(key);
}

// A custom cut is stored and addressed by its label, so it reads the same in
// the roster header, the cut list and the chart axes.
export function allCutFields(customFields = []) {
  return [
    ...BUILT_IN_CUTS,
    ...customFields.map((label) => ({ key: label, label, custom: true })),
  ];
}

export function valueFor(person, key) {
  const value = isBuiltInCut(key) ? person[key] : person.extra?.[key];
  return (value || "").trim();
}

export function cutsFor(people, key) {
  const counts = new Map();
  for (const person of people) {
    const value = valueFor(person, key);
    if (!value) continue;
    counts.set(value, (counts.get(value) || 0) + 1);
  }
  return [...counts.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
}

// Which cut the org-level visuals hang off. Honour an explicit choice when it
// still has values behind it; otherwise fall back to the first populated field,
// so a partly-filled roster still shows something meaningful.
export function primaryCuts(people, customFields = [], preferredKey = null) {
  const fields = allCutFields(customFields);

  if (preferredKey) {
    const cuts = cutsFor(people, preferredKey);
    if (cuts.length > 0) {
      const field = fields.find((f) => f.key === preferredKey);
      return { field: field?.label || preferredKey, key: preferredKey, cuts };
    }
  }

  for (const field of fields) {
    const cuts = cutsFor(people, field.key);
    if (cuts.length > 0) return { field: field.label, key: field.key, cuts };
  }

  return { field: "team", key: "team", cuts: [] };
}

// Cut fields that actually have data behind them — the only ones worth
// offering as an axis.
export function populatedCutFields(people, customFields = []) {
  return allCutFields(customFields).filter(
    (f) => cutsFor(people, f.key).length > 0
  );
}
