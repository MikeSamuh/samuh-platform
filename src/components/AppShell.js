"use client";

import { useState } from "react";
import Image from "next/image";
import { steps } from "@/lib/steps";
import { stepTasks } from "@/lib/stepTasks";
import { useAuth } from "@/lib/AuthContext";
import { useTeamData } from "@/lib/useTeamData";
import IconRail from "@/components/IconRail";
import PathNavigator from "@/components/PathNavigator";
import StepChecklist from "@/components/StepChecklist";
import AdminDashboard from "@/components/AdminDashboard";
import GuidedTour from "@/components/GuidedTour";
import PreparePanel from "@/components/panels/PreparePanel";
import LaunchPanel from "@/components/panels/LaunchPanel";
import AwarenessPanel from "@/components/panels/AwarenessPanel";
import BelongingPanel from "@/components/panels/BelongingPanel";
import ActionPanel from "@/components/panels/ActionPanel";
import styles from "./AppShell.module.css";

const panels = {
  prepare: PreparePanel,
  launch: LaunchPanel,
  awareness: AwarenessPanel,
  belonging: BelongingPanel,
  action: ActionPanel,
};

export default function AppShell() {
  const { profile, isStaff, signOut } = useAuth();
  const team = useTeamData(profile?.team_id, profile?.id);

  const [activeStepId, setActiveStepId] = useState(steps[0].id);
  const [view, setView] = useState(isStaff ? "admin" : "journey");
  const [tourActive, setTourActive] = useState(false);

  const ActivePanel = panels[activeStepId];

  function advanceIfComplete(stepId) {
    if (stepId !== activeStepId) return;
    const index = steps.findIndex((s) => s.id === stepId);
    if (index < steps.length - 1) setActiveStepId(steps[index + 1].id);
  }

  async function completeTask(stepId, taskId) {
    await team.completeTask(stepId, taskId);
    const checks = {
      ...team.taskChecks,
      [stepId]: [...(team.taskChecks[stepId] || []), taskId],
    };
    if (team.isStepComplete(stepId, checks)) advanceIfComplete(stepId);
  }

  async function toggleTask(stepId, taskId) {
    const checked = (team.taskChecks[stepId] || []).includes(taskId);
    if (checked) {
      await team.uncompleteTask(stepId, taskId);
    } else {
      await completeTask(stepId, taskId);
    }
  }

  function selectStep(stepId) {
    const index = steps.findIndex((s) => s.id === stepId);
    if (index > team.unlockedIndex) return;
    setActiveStepId(stepId);
    setView("journey");
  }

  if (team.loading && !isStaff) return null;

  return (
    <div className={styles.shell}>
      <IconRail view={view} onSelectView={setView} showAdmin={isStaff} />
      <div className={styles.main}>
        <div className={styles.header}>
          <Image
            src="/samuh-logo.png"
            alt="Samuh"
            width={140}
            height={45}
            className={styles.logo}
            priority
          />
          <div className={styles.account}>
            <span className={styles.accountName}>
              {profile?.full_name || profile?.email}
              {isStaff && <span className={styles.staffBadge}>Samuh</span>}
            </span>
            <button type="button" className={styles.signOut} onClick={signOut}>
              Sign out
            </button>
          </div>
        </div>

        {view === "admin" && isStaff ? (
          <AdminDashboard />
        ) : (
          <>
            <PathNavigator
              activeStepId={activeStepId}
              onSelect={selectStep}
              unlockedIndex={team.unlockedIndex}
            />
            <div className={styles.stepBody}>
              <div className={styles.stepMain}>
                <ActivePanel
                  team={team}
                  currentMember={team.currentMember}
                  completeTask={completeTask}
                  startTour={() => setTourActive(true)}
                />
              </div>
              <div className={styles.checklistWrap}>
                <StepChecklist
                  stepId={activeStepId}
                  tasks={stepTasks[activeStepId] || []}
                  checked={team.taskChecks[activeStepId] || []}
                  onToggle={toggleTask}
                />
              </div>
            </div>
          </>
        )}
      </div>
      {tourActive && (
        <GuidedTour
          onClose={() => setTourActive(false)}
          onComplete={() => {
            setTourActive(false);
            completeTask("prepare", "tour");
          }}
        />
      )}
    </div>
  );
}
