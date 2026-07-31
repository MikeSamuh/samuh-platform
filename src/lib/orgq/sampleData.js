// Illustrative numbers for the OrgQ result visuals. There is no OrgQ survey
// data yet, and no way to store it without a schema change, so every visual
// that uses these carries a "Sample data" badge.
//
// The rows and columns are real — they come out of the org roster — so only the
// numbers here are stand-ins. Values are derived from a seeded hash rather than
// Math.random so a heat map doesn't reshuffle on every render, which would read
// as a bug.

export function seededScore(key, min = 38, max = 92) {
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return min + (Math.abs(h) % (max - min));
}

// The six capacity bands the app already uses for TeamQ, worst to best.
const BANDS = [
  { max: 45, label: "Distressed", varName: "--band-distressed" },
  { max: 55, label: "Struggling", varName: "--band-struggling" },
  { max: 65, label: "Enduring", varName: "--band-enduring" },
  { max: 75, label: "Managing", varName: "--band-managing" },
  { max: 85, label: "Succeeding", varName: "--band-succeeding" },
  { max: 101, label: "Thriving", varName: "--band-thriving" },
];

export function bandFor(score) {
  return BANDS.find((b) => score < b.max) || BANDS[BANDS.length - 1];
}

export const bandLegend = [...BANDS].reverse();

// The dimensions an org-level report scores each cut against.
export const orgDimensions = [
  "Psychological safety",
  "Belonging",
  "Workload",
  "Clarity of purpose",
  "Recognition",
  "Autonomy",
  "Growth",
  "Trust in leadership",
];

// A cut's overall score is the mean of its heat-map row, so the heat map, the
// hotspot ranking and the priority matrix all agree — they sit next to each
// other and will be read against one another.
export function cutScore(name) {
  const total = orgDimensions.reduce(
    (sum, d) => sum + seededScore(`${name}|${d}`),
    0
  );
  return Math.round(total / orgDimensions.length);
}

// What a hotspot cut most needs — picked deterministically so it stays put.
const NEEDS = [
  "Workload rebalance",
  "Manager coaching",
  "Role clarity",
  "Team rituals",
  "Recognition practice",
  "Psychological safety",
  "Connection time",
];

export function needsFor(key, count = 2) {
  const picks = [];
  for (let i = 0; i < count; i++) {
    const n = NEEDS[seededScore(`${key}:need:${i}`, 0, NEEDS.length)];
    if (!picks.includes(n)) picks.push(n);
  }
  return picks;
}
