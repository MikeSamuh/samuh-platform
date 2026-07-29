// Guided walkthrough stops per step. Targets are [data-tour] attributes in
// that step's panel; stops whose target isn't on screen are skipped, so
// role-specific elements (team name card, admin icon) degrade gracefully.
export const tours = {
  prepare: [
    {
      target: "path",
      title: "Your team journey",
      body: "Five steps: Prepare, Launch, Awareness, Belonging, Action. Finish a step's tasks to unlock the next one — you can always go back.",
    },
    {
      target: "checklist",
      title: "Tasks",
      body: "Everything to do on this step lives here. Tasks check themselves off as you complete each module, or tick them yourself.",
    },
    {
      target: "team-name",
      title: "Name your team",
      body: "Give your team the name it'll carry across the platform.",
    },
    {
      target: "media",
      title: "Watch, read, listen",
      body: "Open a tile to play it — the methodology, why a co-lead matters, and how to run a TeamQ. Opening one counts as completing its task.",
    },
    {
      target: "members",
      title: "Your team",
      body: "Add teammates with their name, email, and tenure — one at a time, or upload a spreadsheet (there's a template to download).",
    },
    {
      target: "colead",
      title: "Pick a co-lead",
      body: "Once your team is in, choose a co-lead to share the journey with you.",
    },
    {
      target: "admin",
      title: "Track progress",
      body: "The activity icon opens the team progress dashboard — step completion, milestones, and who's participated.",
    },
  ],
  launch: [
    {
      target: "checklist",
      title: "Launch tasks",
      body: "Brief your team, launch the assessment, review follow-up practices, and pick your metaphor card.",
    },
    {
      target: "media",
      title: "Get ready to launch",
      body: "How to brief your team — sample email, talking points, FAQ — plus follow-up best practices for running the assessment in a meeting.",
    },
    {
      target: "launch",
      title: "Launch TeamQ+",
      body: "One click invites every team member to take the assessment. Results feed the Awareness step.",
    },
    {
      target: "metaphor",
      title: "Metaphor cards",
      body: "Pick the card that best describes your experience on this team, and say why. Everyone's picks show up below the deck.",
    },
  ],
  awareness: [
    {
      target: "teamq",
      title: "Your TeamQ results",
      body: "The team's score, capacity to perform, and performance loss — the readout you'll unpack together.",
    },
    {
      target: "media",
      title: "Make sense of it",
      body: "Keystone practices, how to read and communicate results, and how to share and reflect on them in a meeting.",
    },
    {
      target: "charts",
      title: "Vote on the results",
      body: "Team environment and team practices, scored 1–9. Click the star next to a row to vote for what matters most to you.",
    },
    {
      target: "reflections",
      title: "Notes & reflections",
      body: "Share what surfaced for you — reflections are anonymous, and everyone's words build the cloud.",
    },
  ],
  belonging: [
    {
      target: "media",
      title: "Practices to try",
      body: "A meta meditation to listen to, an empathy / dialogue walk to learn, and the circle practice to watch.",
    },
    {
      target: "booking",
      title: "Bring Samuh in",
      body: "Optional: schedule an in-person workshop or a 30-minute coaching session whenever you want support.",
    },
  ],
  action: [
    {
      target: "worksheet",
      title: "The collective worksheet",
      body: "Capture your ritual on the canvas — what, why, when, who, how, and prep. Add notes and drag them anywhere.",
    },
    {
      target: "media",
      title: "Make it stick",
      body: "How to take it forward with Samuh, and best practices to keep the ritual alive.",
    },
    {
      target: "keeper",
      title: "Ritual keeper",
      body: "Choose the team member who keeps the ritual alive after this journey ends.",
    },
  ],
};
