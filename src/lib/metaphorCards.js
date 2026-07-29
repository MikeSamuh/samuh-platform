// Metaphor card deck for the Discover step. Each member picks the image that
// best describes their experience on the team, names it themselves, and says
// why. Placeholder art (emoji) until real card imagery exists; names stay for
// accessibility labels and as a fallback for picks saved before self-naming.

// Name + why are stored together in the pick's description column as JSON.
export function parsePickDescription(description) {
  try {
    const parsed = JSON.parse(description);
    if (parsed && typeof parsed === "object") {
      return { name: parsed.name || "", why: parsed.why || "" };
    }
  } catch {
    // Pre-JSON picks stored a plain why-string.
  }
  return { name: "", why: description || "" };
}
export const metaphorCards = [
  { id: "lighthouse", name: "Lighthouse", emoji: "🗼", blurb: "Steady guidance through fog" },
  { id: "orchestra", name: "Orchestra", emoji: "🎻", blurb: "Many parts, one score" },
  { id: "rowing-crew", name: "Rowing crew", emoji: "🚣", blurb: "Power from perfect sync" },
  { id: "campfire", name: "Campfire", emoji: "🔥", blurb: "Warmth people gather around" },
  { id: "beehive", name: "Beehive", emoji: "🐝", blurb: "Busy, buzzing, building" },
  { id: "jazz-band", name: "Jazz band", emoji: "🎷", blurb: "Improvising off each other" },
  { id: "expedition", name: "Expedition", emoji: "🧗", blurb: "Roped together on the climb" },
  { id: "garden", name: "Garden", emoji: "🌱", blurb: "Growing at different speeds" },
  { id: "pit-crew", name: "Pit crew", emoji: "🏎️", blurb: "Fast, precise, coordinated" },
  { id: "flock", name: "Flock", emoji: "🕊️", blurb: "Taking turns leading the V" },
  { id: "kitchen", name: "Busy kitchen", emoji: "🍳", blurb: "Heat, pressure, service" },
  { id: "island", name: "Islands", emoji: "🏝️", blurb: "Beautiful but disconnected" },
];
