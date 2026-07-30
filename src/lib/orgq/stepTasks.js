// Tasks for the OrgQ journey. Same contract as the team journey: each task id
// matches a module on the panel and auto-checks when that module completes, or
// can be ticked by hand; every task must be done before the next step unlocks;
// backwards is always allowed; every step opens with a guided walkthrough.
//
// Two items from the flow diagram fold in rather than becoming their own rows,
// because neither is something you can do twice: "virtual walkthrough of the
// platform" *is* the tour task, and "enter your email" is account signup, which
// already happened before you got here — its copy lives on the invites card.

const tour = {
  id: "tour",
  label: "Take the virtual walkthrough",
  sub: "A guided tour of everything on this step",
};

export const orgqStepTasks = {
  "orgq-prepare": [
    tour,
    {
      id: "pricing",
      label: "Review the demo, pricing and FAQ",
      sub: "What OrgQ covers, what it costs, and the questions we get asked most",
    },
    {
      id: "orientation",
      label: "Watch the welcome video",
      sub: "The methodology behind OrgQ and what the insights tell you",
    },
    {
      id: "terms",
      label: "Review terms, conditions and data privacy",
      sub: "How your people's data is handled, stored and protected",
    },
    {
      id: "package",
      label: "Confirm your package size",
      sub: "How many people across the org OrgQ will cover",
    },
    {
      id: "org-name",
      label: "Name your organisation",
      sub: "How the org appears across reports and readouts",
    },
    {
      id: "roster-howto",
      label: "Learn how to build the roster",
      sub: "A walkthrough of the spreadsheet template and how org cuts work",
    },
    {
      id: "roster",
      label: "Add your org roster",
      sub: "People, email, team, manager and tenure — upload or add one by one",
    },
    {
      id: "invites",
      label: "Send the welcome and invite links",
      sub: "The email that brings everyone onto the platform",
    },
  ],

  "orgq-launch": [
    tour,
    {
      id: "comms",
      label: "Review the communication samples",
      sub: "Announcement email, talking points and best practices",
    },
    {
      id: "awareness-sessions",
      label: "Plan your awareness sessions",
      sub: "Briefing the org before the survey opens",
    },
    {
      id: "stewards",
      label: "Add your OrgQ stewards",
      sub: "Who they are and what they're responsible for",
    },
    {
      id: "steward-kit",
      label: "Share the steward readiness kit",
      sub: "Everything a steward needs to support their part of the org",
    },
    {
      id: "launch-survey",
      label: "Launch the OrgQ survey",
      sub: "Opens the assessment to everyone on the roster",
    },
    {
      id: "monitor",
      label: "Monitor completion progress",
      sub: "Response rates by org cut and across the whole org",
    },
  ],

  "orgq-results": [
    tour,
    {
      id: "csuite",
      label: "Learn how to review with the C-suite",
      sub: "Framing the results for an executive audience",
    },
    {
      id: "interpret",
      label: "Learn how to interpret and discuss results",
      sub: "For team leads: reading the scores and running the conversation",
    },
    {
      id: "reflection-prompts",
      label: "Review the team reflection prompts",
      sub: "Questions that open an honest discussion about the results",
    },
    {
      id: "hotspots",
      label: "Identify your hotspot teams",
      sub: "Where the need is highest and where to start",
    },
    {
      id: "priority",
      label: "Review the priority group matrix",
      sub: "High value against high need, to sequence the work",
    },
    {
      id: "hr-support",
      label: "Learn how HR supports team journeys",
      sub: "The support model behind every team that starts a journey",
    },
  ],

  "orgq-action": [
    tour,
    {
      id: "check-in",
      label: "Schedule your check-in",
      sub: "Reviewing progress with Samuh as the work lands",
    },
    {
      id: "community",
      label: "Organise the community meeting",
      sub: "Bringing leaders, ritual keepers and facilitators together",
    },
    {
      id: "access",
      label: "Open access at team-member level",
      sub: "Everyone on the roster gets into their own team journey",
    },
  ],

  "orgq-closing": [
    tour,
    {
      id: "review-journeys",
      label: "Review the team journeys",
      sub: "What each team built and where they landed",
    },
    {
      id: "benchmark",
      label: "Benchmark TeamQ against OrgQ",
      sub: "How team scores compare to the org-wide picture",
    },
    {
      id: "next-cycle",
      label: "Plan the next cycle",
      sub: "What to repeat, what to change, and when to run again",
    },
    {
      id: "launch-teamq",
      label: "Launch the next TeamQ",
      sub: "Starts the team journey cycle again",
    },
  ],
};
