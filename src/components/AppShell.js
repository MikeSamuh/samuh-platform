"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { steps } from "@/lib/steps";
import { stepTasks } from "@/lib/stepTasks";
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

const INITIAL_MEMBERS = [
  { id: "m-priya", name: "Priya S.", email: "priya@example.com", tenure: "3 years" },
  { id: "m-marcus", name: "Marcus L.", email: "marcus@example.com", tenure: "1 year" },
  { id: "m-devon", name: "Devon R.", email: "devon@example.com", tenure: "6 months" },
];

function newId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function AppShell() {
  const [activeStepId, setActiveStepId] = useState(steps[0].id);
  const [view, setView] = useState("journey");
  const [tourActive, setTourActive] = useState(false);
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [currentMemberIndex, setCurrentMemberIndex] = useState(0);
  const [coLead, setCoLeadState] = useState(null);
  const [launched, setLaunchedState] = useState(false);
  const [cardPicks, setCardPicks] = useState({});
  const [votes, setVotes] = useState({ environment: {}, practices: {} });
  const [reflections, setReflections] = useState([]);
  const [ritualKeeper, setRitualKeeperState] = useState(null);
  const [taskChecks, setTaskChecks] = useState({});

  const ActivePanel = panels[activeStepId];

  function isStepComplete(stepId, checks = taskChecks) {
    const tasks = stepTasks[stepId] || [];
    const checked = checks[stepId] || [];
    return tasks.length > 0 && tasks.every((t) => checked.includes(t.id));
  }

  // The first incomplete step is the furthest one the user can reach.
  let unlockedIndex = steps.length - 1;
  for (let i = 0; i < steps.length; i++) {
    if (!isStepComplete(steps[i].id)) {
      unlockedIndex = i;
      break;
    }
  }

  // Tasks auto-check when their module is completed (one-way), and can also
  // be ticked or unticked by hand in the checklist.
  function completeTask(stepId, taskId) {
    setTaskChecks((prev) => {
      const current = prev[stepId] || [];
      if (current.includes(taskId)) return prev;
      const next = { ...prev, [stepId]: [...current, taskId] };
      maybeAdvance(stepId, next);
      return next;
    });
  }

  function toggleTask(stepId, taskId) {
    setTaskChecks((prev) => {
      const current = prev[stepId] || [];
      const checking = !current.includes(taskId);
      const next = checking
        ? { ...prev, [stepId]: [...current, taskId] }
        : { ...prev, [stepId]: current.filter((id) => id !== taskId) };
      if (checking) maybeAdvance(stepId, next);
      return next;
    });
  }

  // Auto-advance once every task in the active step is complete.
  function maybeAdvance(stepId, checks) {
    if (stepId !== activeStepId || !isStepComplete(stepId, checks)) return;
    const stepIndex = steps.findIndex((s) => s.id === stepId);
    if (stepIndex < steps.length - 1) {
      setActiveStepId(steps[stepIndex + 1].id);
    }
  }

  useEffect(() => {
    if (members.length > 0) completeTask("prepare", "members");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [members]);

  function selectStep(stepId) {
    const index = steps.findIndex((s) => s.id === stepId);
    if (index > unlockedIndex) return;
    setActiveStepId(stepId);
    setView("journey");
  }

  function addMember({ name, email = "", tenure = "" }) {
    if (!name?.trim()) return;
    setMembers((prev) => [
      ...prev,
      { id: newId("m"), name: name.trim(), email, tenure },
    ]);
  }

  function removeMember(id) {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    setCoLeadState((prev) => (prev === id ? null : prev));
    setRitualKeeperState((prev) => (prev === id ? null : prev));
    setCardPicks((prev) => {
      const { [id]: removed, ...rest } = prev;
      return rest;
    });
    setVotes((prev) => {
      const environment = { ...prev.environment };
      const practices = { ...prev.practices };
      delete environment[id];
      delete practices[id];
      return { environment, practices };
    });
    setCurrentMemberIndex(0);
  }

  function setCoLead(id) {
    setCoLeadState(id);
    if (id) completeTask("prepare", "colead");
  }

  function setLaunched(value) {
    setLaunchedState(value);
    if (value) completeTask("launch", "launch-teamq");
  }

  function setRitualKeeper(id) {
    setRitualKeeperState(id);
    if (id) completeTask("action", "ritual-keeper");
  }

  function castVote(chartId, rowLabel) {
    const member = members[Math.min(currentMemberIndex, members.length - 1)];
    if (!member) return;
    setVotes((prev) => {
      const chartVotes = { ...prev[chartId] };
      if (chartVotes[member.id] === rowLabel) {
        delete chartVotes[member.id];
      } else {
        chartVotes[member.id] = rowLabel;
        completeTask("awareness", "vote");
      }
      return { ...prev, [chartId]: chartVotes };
    });
  }

  function pickCard(memberId, cardId) {
    setCardPicks((prev) => ({
      ...prev,
      [memberId]: { cardId, description: prev[memberId]?.description || "" },
    }));
    completeTask("launch", "metaphor");
  }

  function describeCard(memberId, description) {
    setCardPicks((prev) => ({
      ...prev,
      [memberId]: { ...prev[memberId], description },
    }));
  }

  function addReflection({ authorId, text }) {
    setReflections((prev) => [...prev, { id: newId("r"), authorId, text }]);
    completeTask("awareness", "reflect");
  }

  return (
    <div className={styles.shell}>
      <IconRail view={view} onSelectView={setView} />
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
        </div>
        {view === "admin" ? (
          <AdminDashboard
            members={members}
            coLead={coLead}
            launched={launched}
            ritualKeeper={ritualKeeper}
            cardPicks={cardPicks}
            votes={votes}
            reflections={reflections}
            taskChecks={taskChecks}
          />
        ) : (
          <>
            <PathNavigator
              activeStepId={activeStepId}
              onSelect={selectStep}
              unlockedIndex={unlockedIndex}
            />
            <div className={styles.stepBody}>
              <div className={styles.stepMain}>
                <ActivePanel
                  members={members}
                  addMember={addMember}
                  removeMember={removeMember}
                  coLead={coLead}
                  setCoLead={setCoLead}
                  launched={launched}
                  setLaunched={setLaunched}
                  currentMemberIndex={currentMemberIndex}
                  setCurrentMemberIndex={setCurrentMemberIndex}
                  cardPicks={cardPicks}
                  pickCard={pickCard}
                  describeCard={describeCard}
                  votes={votes}
                  castVote={castVote}
                  reflections={reflections}
                  addReflection={addReflection}
                  ritualKeeper={ritualKeeper}
                  setRitualKeeper={setRitualKeeper}
                  completeTask={completeTask}
                  taskChecks={taskChecks}
                  startTour={() => setTourActive(true)}
                />
              </div>
              <div className={styles.checklistWrap}>
                <StepChecklist
                  stepId={activeStepId}
                  tasks={stepTasks[activeStepId] || []}
                  checked={taskChecks[activeStepId] || []}
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
