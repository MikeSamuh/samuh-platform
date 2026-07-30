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
//
// Built-in cuts can be hidden but not deleted — an org that doesn't think in
// tenure shouldn't have to look at it, but the roster data behind it is never
// thrown away, so putting it back restores everything.
export function allCutFields(customFields = [], hiddenKeys = []) {
  const hidden = new Set(hiddenKeys);
  return [
    ...BUILT_IN_CUTS,
    ...customFields.map((label) => ({ key: label, label, custom: true })),
  ].filter((f) => !hidden.has(f.key));
}

export function hiddenBuiltIns(hiddenKeys = []) {
  return BUILT_IN_CUTS.filter((f) => hiddenKeys.includes(f.key));
}

export function valueFor(person, key) {
  const value = isBuiltInCut(key) ? person[key] : person.extra?.[key];
  return (value || "").trim();
}

// Individual cut values are addressed as "field::value" so declarations and
// hidden entries can share one reserved row each. A value containing "::" would
// be ambiguous; nothing produces one, and the split below takes only the first
// separator so a stray one degrades rather than breaks.
export const valueKey = (field, value) => `${field}::${value}`;

export function parseValueKey(raw) {
  const at = raw.indexOf("::");
  if (at === -1) return null;
  return { field: raw.slice(0, at), value: raw.slice(at + 2) };
}

function keysFor(entries, field) {
  const out = new Set();
  for (const raw of entries) {
    const parsed = parseValueKey(raw);
    if (parsed && parsed.field === field) out.add(parsed.value);
  }
  return out;
}

// The groups within a cut are exactly the distinct values the roster holds for
// that field, minus any the org has removed. Nothing can be invented here — a
// group only exists because somebody on the roster is in it.
export function cutsFor(people, key, hidden = []) {
  const counts = new Map();
  for (const person of people) {
    const value = valueFor(person, key);
    if (!value) continue;
    counts.set(value, (counts.get(value) || 0) + 1);
  }

  const removed = keysFor(hidden, key);
  return [...counts.entries()]
    .filter(([value]) => !removed.has(value))
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
}

// Groups that exist in the roster but have been removed from reporting — the
// only things that can be added back, and the only thing "add" can offer.
export function restorableCutValues(people, key, hidden = []) {
  const removed = keysFor(hidden, key);
  const inRoster = new Set();
  for (const person of people) {
    const value = valueFor(person, key);
    if (value && removed.has(value)) inRoster.add(value);
  }
  return [...inRoster].sort();
}

// Which cut the org-level visuals hang off. Honour an explicit choice when it
// still has values behind it; otherwise fall back to the first populated field,
// so a partly-filled roster still shows something meaningful.
// The aggregate helpers take one options bag rather than five positional
// arguments, since they all need the same four lists.
export function primaryCuts(
  people,
  { fields = [], hiddenFields = [], hiddenValues = [], preferred = null } = {}
) {
  const available = allCutFields(fields, hiddenFields);

  if (preferred) {
    const cuts = cutsFor(people, preferred, hiddenValues);
    if (cuts.length > 0) {
      const field = available.find((f) => f.key === preferred);
      return { field: field?.label || preferred, key: preferred, cuts };
    }
  }

  for (const field of available) {
    const cuts = cutsFor(people, field.key, hiddenValues);
    if (cuts.length > 0) return { field: field.label, key: field.key, cuts };
  }

  return { field: "team", key: "team", cuts: [] };
}

// Cut fields that actually have data behind them — the only ones worth
// offering as an axis.
export function populatedCutFields(
  people,
  { fields = [], hiddenFields = [], hiddenValues = [] } = {}
) {
  return allCutFields(fields, hiddenFields).filter(
    (f) => cutsFor(people, f.key, hiddenValues).length > 0
  );
}
