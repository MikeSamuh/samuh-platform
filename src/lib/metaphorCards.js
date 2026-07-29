// Metaphor card deck for the Discover step. Each member picks the image that
// best describes their experience on the team, names it themselves, and says
// why.
//
// `src` points at the illustration in /public/cards (white line art on black,
// one accent colour, in the Samuh hand-drawn style). Cards still awaiting
// illustration have `src: null` and fall back to a hand-lettered name on the
// same black card, so the deck is usable now; `brief` is the illustrator's
// note for what the drawing should show. `name` is never shown on the deck —
// it is the accessibility label, and the fallback if a member doesn't rename
// the card themselves.

export const metaphorCards = [
  // ——— Direction and alignment ———
  {
    id: "same-boat",
    name: "Same Boat, Different Directions",
    src: "/cards/boat.png",
    accent: "#7fb0d4",
    brief: "Crew in one rowboat pulling opposite ways while one person points ahead.",
  },
  {
    id: "two-maps",
    name: "Two Maps, One Journey",
    src: null,
    accent: "#7fb0d4",
    brief: "Two people back to back, each holding a different map, walking apart.",
  },
  {
    id: "tug-of-war",
    name: "Tug of War",
    src: null,
    accent: "#d4699c",
    brief: "Rope pulled hard from both ends, no one moving, knot in the middle.",
  },
  {
    id: "north-stars",
    name: "Everyone's Own North Star",
    src: null,
    accent: "#d9a441",
    brief: "Figures looking up at different stars, each pointing somewhere else.",
  },

  // ——— Load, pace and pressure ———
  {
    id: "unique-chaos",
    name: "Unique Chaos",
    src: "/cards/chaos.png",
    accent: "#d4699c",
    brief: "Tangled threads inside a circle, loose ends spilling out.",
  },
  {
    id: "firefighting",
    name: "Firefighting vs. Preventing",
    src: "/cards/firefighters.png",
    accent: "#d9a441",
    brief: "Crew hosing a wall of small fires while one person holds the blueprint.",
  },
  {
    id: "spinning-plates",
    name: "Spinning Plates",
    src: null,
    accent: "#d9a441",
    brief: "One figure spinning many plates on poles, one already wobbling.",
  },
  {
    id: "rush-hour",
    name: "Rush Hour, Every Hour",
    src: null,
    accent: "#d4699c",
    brief: "Dense traffic of tiny figures, all crossing, no one stopping.",
  },
  {
    id: "juggling-glass",
    name: "Juggling Glass and Rubber",
    src: null,
    accent: "#d4699c",
    brief: "A juggler mid-throw; some balls drawn as glass, some as rubber.",
  },
  {
    id: "piano",
    name: "Carrying the Piano Together",
    src: null,
    accent: "#7fb383",
    brief: "Several figures carrying one heavy piano up stairs, straining but together.",
  },

  // ——— Perseverance ———
  {
    id: "little-engine",
    name: "The Little Engine That Could",
    src: "/cards/engine.png",
    accent: "#d9a441",
    brief: "Small train climbing a steep mountain track, summit in sight.",
  },
  {
    id: "upstream",
    name: "Rowing Upstream",
    src: null,
    accent: "#7fb0d4",
    brief: "Boat pointed against a strong current, oars deep, making slow ground.",
  },
  {
    id: "last-mile",
    name: "The Last Mile",
    src: null,
    accent: "#d9a441",
    brief: "Runners near a finish line, tired but leaning forward.",
  },
  {
    id: "bridge-crossing",
    name: "Building the Bridge While Crossing It",
    src: null,
    accent: "#d9a441",
    brief: "Figures laying planks just ahead of their own feet over a gap.",
  },

  // ——— Belonging and connection ———
  {
    id: "new-kid",
    name: "New Kid on the Block",
    src: "/cards/kid.png",
    accent: "#7fb0d4",
    brief: "A newcomer walking past an established group that isn't looking over.",
  },
  {
    id: "islands",
    name: "Islands in the Same Sea",
    src: null,
    accent: "#7fb0d4",
    brief: "Separate small islands, one figure each, no bridges between them.",
  },
  {
    id: "extra-chairs",
    name: "The Table With Extra Chairs",
    src: null,
    accent: "#7fb383",
    brief: "A full table with space deliberately left, chairs pulled out invitingly.",
  },
  {
    id: "campfire",
    name: "The Campfire",
    src: null,
    accent: "#d9a441",
    brief: "Figures in a ring around a fire, faces lit, leaning in.",
  },
  {
    id: "potluck",
    name: "Potluck",
    src: null,
    accent: "#7fb383",
    brief: "Everyone arriving with a different dish, table filling up.",
  },

  // ——— Flow and craft ———
  {
    id: "orchestra",
    name: "The Orchestra Finding Its Key",
    src: null,
    accent: "#8b83d9",
    brief: "Players mid-tune-up, conductor's baton raised, not yet in unison.",
  },
  {
    id: "jazz",
    name: "Jazz Quartet",
    src: null,
    accent: "#8b83d9",
    brief: "Four players improvising, one soloing while the others hold the groove.",
  },
  {
    id: "relay",
    name: "The Relay Handoff",
    src: null,
    accent: "#7fb383",
    brief: "Baton passing between two runners in the exchange zone.",
  },
  {
    id: "pit-crew",
    name: "The Pit Crew",
    src: null,
    accent: "#d4699c",
    brief: "Crew swarming a car in perfect choreography, stopwatch running.",
  },
  {
    id: "murmuration",
    name: "Murmuration",
    src: null,
    accent: "#7fb0d4",
    brief: "A flock of birds turning as one shape, no visible leader.",
  },

  // ——— Growth ———
  {
    id: "greenhouse",
    name: "The Greenhouse",
    src: null,
    accent: "#7fb383",
    brief: "Plants at different stages under glass, someone watering.",
  },
  {
    id: "scaffolding",
    name: "Scaffolding Coming Down",
    src: null,
    accent: "#d9a441",
    brief: "A finished structure with scaffolding half removed, standing on its own.",
  },

  // ——— Trust and voice ———
  {
    id: "safety-net",
    name: "The Net Below the Wire",
    src: null,
    accent: "#7fb383",
    brief: "Tightrope walker crossing confidently, a net stretched below.",
  },
  {
    id: "telephone-game",
    name: "The Telephone Game",
    src: null,
    accent: "#d4699c",
    brief: "A whisper chain where the first and last speech bubbles differ wildly.",
  },
  {
    id: "through-glass",
    name: "Talking Through Glass",
    src: null,
    accent: "#7fb0d4",
    brief: "Two figures mouthing at each other through a pane, hands pressed flat.",
  },
  {
    id: "radio-silence",
    name: "Radio Silence",
    src: null,
    accent: "#7fb0d4",
    brief: "A figure with a transmitter, empty speech bubbles, no reply coming back.",
  },
];

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
