// The org-wide journey that sits above the team journeys. Step ids carry an
// `orgq-` prefix because they share the step_progress table with the team
// journey's rows.
export const orgqSteps = [
  { id: "orgq-prepare", label: "Prepare" },
  { id: "orgq-launch", label: "Launch" },
  { id: "orgq-results", label: "Results" },
  { id: "orgq-action", label: "Action" },
  { id: "orgq-closing", label: "Closing" },
];
