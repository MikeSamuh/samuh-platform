// Progress maths for any journey. These used to live in useTeamData, hardwired
// to the team journey's step list — which meant a second journey's steps would
// silently read as "never complete" and lock at step one. Taking the journey
// descriptor as an argument keeps the data layer journey-agnostic.

export function isStepComplete(journey, stepId, taskChecks) {
  const tasks = journey.stepTasks[stepId] || [];
  const checked = taskChecks[stepId] || [];
  return tasks.length > 0 && tasks.every((t) => checked.includes(t.id));
}

// Steps unlock in the order this role sees them, so unlock is computed over the
// visible list rather than the full one.
export function unlockedIndexFor(journey, visibleSteps, taskChecks) {
  for (let i = 0; i < visibleSteps.length; i++) {
    if (!isStepComplete(journey, visibleSteps[i].id, taskChecks)) return i;
  }
  return visibleSteps.length - 1;
}

export function visibleStepsFor(journey, { isManager, isStaff }) {
  if (isManager || isStaff) return journey.steps;
  return journey.steps.filter((s) => !journey.hiddenForMember.includes(s.id));
}
