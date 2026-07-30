// Guided-tour stops per OrgQ step. `target` matches a data-tour attribute on
// the step's panel. GuidedTour resolves targets with a global querySelector and
// silently skips stops it can't find, so target names must match the panel
// exactly — and only one journey is ever mounted, so reusing names like "media"
// across journeys is safe.

export const orgqTours = {
  "orgq-prepare": [
    {
      target: "path",
      title: "The OrgQ journey",
      body: "Five steps, from setting the org up through to closing the cycle. Each one unlocks when its tasks are done — you can always go back.",
    },
    {
      target: "checklist",
      title: "Your tasks",
      body: "Everything this step needs. Most tick themselves as you work; you can also check them off by hand.",
    },
    {
      target: "org-setup",
      title: "Name the org and size the package",
      body: "The org name appears across every report and readout. Package size is how many people OrgQ will cover — no payment is taken here.",
    },
    {
      target: "media",
      title: "Get oriented",
      body: "Pricing and FAQ, the welcome video, the data privacy review, and a walkthrough of how to build your roster.",
    },
    {
      target: "roster",
      title: "Add your roster",
      body: "People, email, team, manager and tenure. Upload a spreadsheet or add them one at a time — this is what the whole assessment runs on.",
    },
    {
      target: "cuts",
      title: "Your org cuts",
      body: "These come straight out of the roster. Every result later in the journey can be sliced by team, manager or tenure.",
    },
  ],

  "orgq-launch": [
    {
      target: "media",
      title: "Prepare the org",
      body: "Announcement samples, how to run awareness sessions, and the readiness kit your stewards will need.",
    },
    {
      target: "stewards",
      title: "OrgQ stewards",
      body: "The people who carry the rollout in their part of the org — they answer questions, chase completion and keep momentum.",
    },
    {
      target: "launch",
      title: "Launch the survey",
      body: "Opens the assessment to everyone on the roster. You can relaunch later if you need another wave.",
    },
    {
      target: "monitor",
      title: "Watch completion",
      body: "Response rates by org cut and overall, so you can see which parts of the org need a nudge.",
    },
  ],

  "orgq-results": [
    {
      target: "score",
      title: "Your OrgQ score",
      body: "The org-wide picture: capacity, and what the current state is costing in performance.",
    },
    {
      target: "heatmap",
      title: "Where the risk sits",
      body: "Every org cut against every dimension. The warm cells are where the need is highest.",
    },
    {
      target: "hotspots",
      title: "Hotspot teams",
      body: "The groups the heat map surfaces first — ranked, with what each one needs.",
    },
    {
      target: "matrix",
      title: "Priority groups",
      body: "Need against value. The top-right quadrant is where a team journey pays back fastest.",
    },
    {
      target: "media",
      title: "How to run the conversations",
      body: "Framing the readout for the C-suite, helping team leads interpret their own results, and how HR supports the journeys that follow.",
    },
  ],

  "orgq-action": [
    {
      target: "access",
      title: "Open access",
      body: "This is where the org hands over: everyone on the roster gets into their own team journey.",
    },
    {
      target: "booking",
      title: "Check in and convene",
      body: "A check-in with Samuh as the work lands, and a community meeting that brings leaders, ritual keepers and facilitators together.",
    },
  ],

  "orgq-closing": [
    {
      target: "review",
      title: "Review the team journeys",
      body: "Where every team got to — which steps they finished and what they built.",
    },
    {
      target: "benchmark",
      title: "TeamQ against OrgQ",
      body: "How the team-level scores compare to the org-wide picture, so you can see what actually shifted.",
    },
    {
      target: "booking",
      title: "Plan the next cycle",
      body: "What to repeat, what to change, and when to run OrgQ again.",
    },
  ],
};
