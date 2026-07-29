// Per-step task checklists shown in the right-side box. Every task maps 1:1
// to a module in the panel and is checked automatically when that module is
// completed (video opened, walkthrough finished, selection made, etc), or can
// be ticked by hand. A step's tasks must all complete before the next step
// unlocks; backwards is always allowed. Scheduling with Samuh is offered on
// every step but never required. Every step opens with a guided walkthrough.
//
// Each task carries a `sub` — one line on what doing it actually involves.
export const stepTasks = {
  prepare: [
    {
      id: "tour",
      label: "Take the virtual walkthrough",
      sub: "A guided tour of everything on this step",
    },
    {
      id: "team-name",
      label: "Name your team",
      sub: "What this team is called across the platform",
    },
    {
      id: "methodology",
      label: "Watch the methodology walkthrough",
      sub: "How the Samuh approach works, start to finish",
    },
    {
      id: "colead-why",
      label: "Watch why a co-lead matters",
      sub: "What a co-lead does and why you want one",
    },
    {
      id: "run-teamq",
      label: "Learn how to run a TeamQ",
      sub: "Launching the assessment and reading the report",
    },
    {
      id: "members",
      label: "Add your team members",
      sub: "Name, email, and tenure — or upload a spreadsheet",
    },
    {
      id: "colead",
      label: "Identify a co-lead",
      sub: "Pick the teammate who shares the journey with you",
    },
  ],
  launch: [
    {
      id: "tour",
      label: "Take the virtual walkthrough",
      sub: "A guided tour of everything on this step",
    },
    {
      id: "brief-team",
      label: "Watch how to brief your team",
      sub: "Sample email, talking points, and an FAQ",
    },
    {
      id: "launch-teamq",
      label: "Launch the TeamQ+ assessment",
      sub: "Invites every member on your roster",
    },
    {
      id: "follow-up",
      label: "Review follow-up best practices",
      sub: "Running the assessment well in a live meeting",
    },
  ],
  discover: [
    {
      id: "tour",
      label: "Take the virtual walkthrough",
      sub: "A guided tour of everything on this step",
    },
    {
      id: "metaphor",
      label: "Choose your metaphor card",
      sub: "Pick an image, name it, and say why it fits",
    },
    {
      id: "survey",
      label: "Take the TeamQ+ survey",
      sub: "Opens in a new window — about 15 minutes",
    },
  ],
  awareness: [
    {
      id: "tour",
      label: "Take the virtual walkthrough",
      sub: "A guided tour of everything on this step",
    },
    {
      id: "keystone-video",
      label: "Watch the Keystone practices overview",
      sub: "The practices that hold a team together",
    },
    {
      id: "keystone-pdf",
      label: "Read the Keystone practices guide",
      sub: "A reference to keep beside your results",
    },
    {
      id: "share-reflect",
      label: "Review sharing results in a meeting",
      sub: "How to open the conversation without defensiveness",
    },
    {
      id: "vote",
      label: "Vote on the results",
      sub: "One star for environment, one for practices",
    },
    {
      id: "reflect",
      label: "Share a note or reflection",
      sub: "Anonymous — your words join the team's cloud",
    },
  ],
  belonging: [
    {
      id: "tour",
      label: "Take the virtual walkthrough",
      sub: "A guided tour of everything on this step",
    },
    {
      id: "meditation",
      label: "Listen to the meta meditation",
      sub: "A short guided recording to settle the team",
    },
    {
      id: "empathy-walk",
      label: "Learn the empathy walk",
      sub: "A paired dialogue practice you can run anywhere",
    },
    {
      id: "circle-practice",
      label: "Learn the circle practice",
      sub: "Giving everyone a turn to be heard",
    },
  ],
  action: [
    {
      id: "tour",
      label: "Take the virtual walkthrough",
      sub: "A guided tour of everything on this step",
    },
    {
      id: "worksheet",
      label: "Add to the practice canvas",
      sub: "Design the ritual: what, why, when, who, how, prep",
    },
    {
      id: "ritual-keeper",
      label: "Select two ritual keepers",
      sub: "A rotating three-month role, shared by two people",
    },
    {
      id: "make-it-stick",
      label: "Watch how to make it stick",
      sub: "Keeping the ritual alive past the first month",
    },
    {
      id: "take-forward",
      label: "Watch how to take it forward",
      sub: "What ongoing support with Samuh looks like",
    },
    {
      id: "closing",
      label: "Review the closing guide",
      sub: "Ending the journey well, together",
    },
  ],
};
