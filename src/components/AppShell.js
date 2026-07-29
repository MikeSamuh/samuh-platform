"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { steps } from "@/lib/steps";
import { stepTasks } from "@/lib/stepTasks";
import { tours } from "@/lib/tours";
import { useAuth } from "@/lib/AuthContext";
import { useTeamData } from "@/lib/useTeamData";
import IconRail from "@/components/IconRail";
import PathNavigator from "@/components/PathNavigator";
import StepChecklist from "@/components/StepChecklist";
import AdminDashboard from "@/components/AdminDashboard";
import ReadinessKit from "@/components/views/ReadinessKit";
import Notifications from "@/components/views/Notifications";
import SurveyLinks from "@/components/views/SurveyLinks";
import GuidedTour from "@/components/GuidedTour";
import TeamName from "@/components/TeamName";
import TourCard from "@/components/TourCard";
import RoleSwitcher from "@/components/RoleSwitcher";
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
  const { profile, isStaff, isManager } = useAuth();
  const team = useTeamData(profile?.team_id, profile?.id);

  const [activeStepId, setActiveStepId] = useState(steps[0].id);
  const [view, setView] = useState("journey");
  const [tourActive, setTourActive] = useState(false);

  const ActivePanel = panels[activeStepId];
  const activeStep = steps.find((s) => s.id === activeStepId);

  // Staff land on the dashboard; switching roles resets the view sensibly.
  useEffect(() => {
    setView(isStaff ? "admin" : "journey");
    setTourActive(false);
  }, [isStaff, profile?.id]);

  // Advance whenever the active step's checklist fills up, no matter which
  // path completed the last task (checkbox, media open, co-lead select,
  // team rename — several complete tasks inside the data layer).
  useEffect(() => {
    if (view !== "journey" || team.loading) return;
    if (!team.isStepComplete(activeStepId)) return;
    const index = steps.findIndex((s) => s.id === activeStepId);
    if (index < steps.length - 1) setActiveStepId(steps[index + 1].id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [team.taskChecks, team.loading, view]);

  const completeTask = team.completeTask;

  async function toggleTask(stepId, taskId) {
    const checked = (team.taskChecks[stepId] || []).includes(taskId);
    if (checked) {
      await team.uncompleteTask(stepId, taskId);
    } else {
      await team.completeTask(stepId, taskId);
    }
  }

  function selectStep(stepId) {
    const index = steps.findIndex((s) => s.id === stepId);
    if (index > team.unlockedIndex) return;
    setActiveStepId(stepId);
    setView("journey");
  }

  function selectView(id) {
    if ((id === "admin" || id === "surveys") && !isStaff) return;
    setView(id);
    setTourActive(false);
  }

  if (team.loading && !isStaff) return null;

  return (
    <div className={styles.shell}>
      <IconRail view={view} onSelectView={selectView} showAdmin={isStaff} />
      <div className={styles.main}>
        <div className={styles.header}>
          <div className={styles.brand}>
            <Image
              src="/samuh-logo.png"
              alt="Samuh"
              width={140}
              height={45}
              className={styles.logo}
              priority
            />
            <span className={styles.appTitle}>Ritualizer</span>
          </div>
          <div className={styles.account}>
            {!isStaff && (
              <TeamName team={team.team} canRename={isManager} onRename={team.renameTeam} />
            )}
            <RoleSwitcher currentRole={profile?.role} />
          </div>
        </div>

        {team.error && (
          <div className={styles.errorBar} role="alert">
            <span>{team.error}</span>
            <button type="button" className={styles.errorDismiss} onClick={team.dismissError}>
              Dismiss
            </button>
          </div>
        )}

        {view === "kit" ? (
          <ReadinessKit team={team} isStaff={isStaff} />
        ) : view === "notifications" ? (
          <Notifications team={team} isStaff={isStaff} />
        ) : view === "surveys" && isStaff ? (
          <SurveyLinks />
        ) : view === "admin" && isStaff ? (
          <AdminDashboard />
        ) : isStaff ? (
          // Samuh staff belong to no team, so the journey has nothing to read
          // or write. Say so instead of showing an empty, silently-failing form.
          <div className={styles.staffNotice}>
            <div className={styles.staffNoticeTitle}>You&apos;re viewing as Samuh Admin</div>
            <p className={styles.staffNoticeBody}>
              Staff accounts aren&apos;t part of any client team, so there&apos;s no journey to
              fill in here. Use the team progress dashboard to see how every client team is
              doing, or switch to Manager or Team Member in the dropdown to walk the journey.
            </p>
            <button
              type="button"
              className={styles.staffNoticeButton}
              onClick={() => setView("admin")}
            >
              Go to team progress
            </button>
          </div>
        ) : (
          <>
            <PathNavigator
              activeStepId={activeStepId}
              onSelect={selectStep}
              unlockedIndex={team.unlockedIndex}
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
                  completeTask={completeTask}
                  canManage={isManager}
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
          stops={tours[activeStepId] || []}
          onClose={() => setTourActive(false)}
          onComplete={() => {
            setTourActive(false);
            completeTask(activeStepId, "tour");
          }}
        />
      )}
    </div>
  );
}
