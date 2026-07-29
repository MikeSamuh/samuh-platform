// Per-step task checklists shown in the right-side box. Every task maps 1:1
// to a module in the panel and is checked automatically when that module is
// completed (video opened, tour finished, selection made, etc). A step's
// tasks must all complete before the next step unlocks; backwards is always
// allowed. Scheduling with Samuh is offered on every step but never required.
export const stepTasks = {
  prepare: [
    { id: "methodology", label: "Watch the Samuh methodology & awareness walkthrough" },
    { id: "colead-why", label: "Watch why a co-lead matters" },
    { id: "tour", label: "Take the virtual tour of the platform" },
    { id: "run-teamq", label: "Learn how to run a TeamQ & read reports" },
    { id: "members", label: "Add your team members" },
    { id: "colead", label: "Identify a co-lead for the team" },
  ],
  launch: [
    { id: "brief-team", label: "Watch how to brief your team" },
    { id: "launch-teamq", label: "Launch the TeamQ+ assessment" },
    { id: "follow-up", label: "Review follow-up best practices" },
    { id: "metaphor", label: "Choose your metaphor card" },
  ],
  awareness: [
    { id: "keystone-video", label: "Watch the Keystone practices overview" },
    { id: "keystone-pdf", label: "Read the Keystone practices guide" },
    { id: "read-results", label: "Learn how to read & communicate your results" },
    { id: "share-reflect", label: "Review sharing & reflecting in a meeting" },
    { id: "vote", label: "Vote on the results" },
    { id: "reflect", label: "Share a note or reflection" },
  ],
  belonging: [
    { id: "meditation", label: "Listen to the meta meditation" },
    { id: "empathy-walk", label: "Learn the empathy / dialogue walk" },
    { id: "circle-practice", label: "Learn the circle practice" },
  ],
  action: [
    { id: "worksheet", label: "Add to the collective worksheet" },
    { id: "take-forward", label: "Watch how to take it forward with Samuh" },
    { id: "ritual-keeper", label: "Select a ritual keeper" },
    { id: "make-it-stick", label: "Watch best practices to make it stick" },
  ],
};
