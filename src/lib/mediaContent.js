// Media items per step. Each item's id doubles as its checklist task id —
// opening the item auto-checks the task. `src: null` renders a placeholder
// player; swap in real hosted URLs (Supabase storage or external) as they
// exist.

export const prepareMedia = [
  {
    id: "methodology",
    name: "The Samuh methodology & awareness",
    type: "video",
    meta: "Walkthrough",
    src: null,
  },
  {
    id: "colead-why",
    name: "Why a co-lead matters",
    type: "video",
    meta: "Short watch",
    src: null,
  },
  {
    id: "run-teamq",
    name: "How to run a TeamQ & read reports",
    type: "video",
    meta: "How-to",
    src: null,
  },
];

export const launchMedia = [
  {
    id: "brief-team",
    name: "How to brief your team",
    type: "video",
    meta: "Sample email · talking points · FAQ",
    src: null,
  },
  {
    id: "follow-up",
    name: "Follow-up best practices",
    type: "pdf",
    meta: "Completing the assessment in a meeting · tips & tricks",
    src: null,
  },
];

export const awarenessMedia = [
  {
    id: "keystone-video",
    name: "Keystone practices",
    type: "video",
    meta: "Overview",
    src: null,
  },
  {
    id: "keystone-pdf",
    name: "Keystone practices guide",
    type: "pdf",
    meta: "Reference",
    src: null,
  },
  {
    id: "read-results",
    name: "How to read & communicate your results",
    type: "video",
    meta: "How-to",
    src: null,
  },
  {
    id: "share-reflect",
    name: "Sharing & reflecting on results in a meeting",
    type: "pdf",
    meta: "Guide",
    src: null,
  },
];

export const belongingMedia = [
  {
    id: "meditation",
    name: "Meta meditation",
    type: "audio",
    meta: "Voice recording",
    src: null,
  },
  {
    id: "empathy-walk",
    name: "Empathy / dialogue walk",
    type: "pdf",
    meta: "How-to guide",
    src: null,
  },
  {
    id: "circle-practice",
    name: "Circle practice",
    type: "video",
    meta: "How-to",
    src: null,
  },
];

export const actionMedia = [
  {
    id: "take-forward",
    name: "Taking it forward with Samuh",
    type: "video",
    meta: "Next steps",
    src: null,
  },
  {
    id: "make-it-stick",
    name: "Best practices to make it stick",
    type: "video",
    meta: "How-to",
    src: null,
  },
];
