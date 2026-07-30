"use client";

import { useEffect, useRef, useState } from "react";
import PathNavigator from "@/components/PathNavigator";
import StepChecklist from "@/components/StepChecklist";
import TourCard from "@/components/TourCard";
import GuidedTour from "@/components/GuidedTour";
import { isStepComplete, unlockedIndexFor, visibleStepsFor } from "@/lib/journeys/progress";
import styles from "./JourneyView.module.css";

// One journey, rendered from its descriptor: the step path, the walkthrough
// card, the active panel and the task checklist. Both the team journey and the
// OrgQ journey run through here, so any fix lands in both.
export default function JourneyView({
  journey,
  team,
  isManager,
  isStaff,
  activeStepId,
  onSelectStep,
}) {
  const [tourActive, setTourActive] = useState(false);

  const visibleSteps = visibleStepsFor(journey, { isManager, isStaff });
  const unlockedIndex = unlockedIndexFor(journey, visibleSteps, team.taskChecks);
  const activeStep = journey.steps.find((s) => s.id === activeStepId);
  const ActivePanel = journey.panels[activeStepId];

  // Advance whenever the active step's checklist fills up, no matter which path
  // completed the last task (checkbox, media open, co-lead select, team rename —
  // several complete tasks inside the data layer). Only fires on a real task
  // change, so restoring a finished step on refresh doesn't bounce the user
  // forward. The ref resets when the journey unmounts, which makes a tab switch
  // back a first pass rather than a jump.
  // Only this journey's own step rows count. taskChecks also carries reserved
  // non-step keys (the org roster, cut fields, ritual keepers, canvases), and
  // watching the whole blob meant adding a roster row read as "a task changed"
  // and jumped the user to the next step.
  const stepSignature = JSON.stringify(
    journey.steps.map((s) => team.taskChecks[s.id] || [])
  );

  const seenChecks = useRef(null);
  useEffect(() => {
    if (team.loading) return;
    const signature = stepSignature;
    const firstPass = seenChecks.current === null;
    const unchanged = seenChecks.current === signature;
    seenChecks.current = signature;
    if (firstPass || unchanged) return;
    if (!isStepComplete(journey, activeStepId, team.taskChecks)) return;

    const index = visibleSteps.findIndex((s) => s.id === activeStepId);
    if (index !== -1 && index < visibleSteps.length - 1) {
      onSelectStep(visibleSteps[index + 1].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepSignature, team.loading]);

  // Leaving a step mid-walkthrough shouldn't leave the overlay up.
  useEffect(() => {
    setTourActive(false);
  }, [activeStepId]);

  async function toggleTask(stepId, taskId) {
    const checked = (team.taskChecks[stepId] || []).includes(taskId);
    if (checked) {
      await team.uncompleteTask(stepId, taskId);
    } else {
      await team.completeTask(stepId, taskId);
    }
  }

  function selectStep(stepId) {
    const index = visibleSteps.findIndex((s) => s.id === stepId);
    if (index === -1 || index > unlockedIndex) return;
    onSelectStep(stepId);
  }

  if (!ActivePanel) return null;

  return (
    <>
      <PathNavigator
        steps={visibleSteps}
        navLabel={journey.navLabel}
        activeStepId={activeStepId}
        onSelect={selectStep}
        unlockedIndex={unlockedIndex}
      />
      <div className={styles.stepBody}>
        <div className={styles.stepMain}>
          <div className={styles.tourSlot}>
            <TourCard
              stepLabel={activeStep?.label}
              onStart={() => setTourActive(true)}
              completed={(team.taskChecks[activeStepId] || []).includes("tour")}
            />
          </div>
          <ActivePanel
            team={team}
            currentMember={team.currentMember}
            completeTask={team.completeTask}
            canManage={isManager}
          />
        </div>
        <div className={styles.checklistWrap}>
          <StepChecklist
            stepId={activeStepId}
            tasks={journey.stepTasks[activeStepId] || []}
            checked={team.taskChecks[activeStepId] || []}
            onToggle={toggleTask}
          />
        </div>
      </div>
      {tourActive && (
        <GuidedTour
          stops={journey.tours[activeStepId] || []}
          onClose={() => setTourActive(false)}
          onComplete={() => {
            setTourActive(false);
            team.completeTask(activeStepId, "tour");
          }}
        />
      )}
    </>
  );
}
