"use client";

import { useState } from "react";
import Image from "next/image";
import { steps } from "@/lib/steps";
import IconRail from "@/components/IconRail";
import PathNavigator from "@/components/PathNavigator";
import DiscoveryPanel from "@/components/panels/DiscoveryPanel";
import LaunchPanel from "@/components/panels/LaunchPanel";
import AwarenessPanel from "@/components/panels/AwarenessPanel";
import BelongingPanel from "@/components/panels/BelongingPanel";
import ActionPanel from "@/components/panels/ActionPanel";
import styles from "./AppShell.module.css";

const panels = {
  discovery: DiscoveryPanel,
  launch: LaunchPanel,
  awareness: AwarenessPanel,
  belonging: BelongingPanel,
  action: ActionPanel,
};

const INITIAL_MEMBERS = ["Priya S.", "Marcus L.", "Devon R."];

export default function AppShell() {
  const [activeStepId, setActiveStepId] = useState(steps[0].id);
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [currentMemberIndex, setCurrentMemberIndex] = useState(0);
  const [votes, setVotes] = useState({ environment: {}, practices: {} });
  const ActivePanel = panels[activeStepId];

  function addMember(name) {
    const trimmed = name.trim();
    if (!trimmed) return;
    setMembers((prev) => [...prev, trimmed]);
  }

  function removeMember(index) {
    setMembers((prev) => prev.filter((_, i) => i !== index));
  }

  function castVote(chartId, rowLabel) {
    setVotes((prev) => {
      const chartVotes = { ...prev[chartId] };
      if (chartVotes[currentMemberIndex] === rowLabel) {
        delete chartVotes[currentMemberIndex];
      } else {
        chartVotes[currentMemberIndex] = rowLabel;
      }
      return { ...prev, [chartId]: chartVotes };
    });
  }

  return (
    <div className={styles.shell}>
      <IconRail />
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
        <PathNavigator activeStepId={activeStepId} onSelect={setActiveStepId} />
        <ActivePanel
          members={members}
          addMember={addMember}
          removeMember={removeMember}
          currentMemberIndex={currentMemberIndex}
          setCurrentMemberIndex={setCurrentMemberIndex}
          votes={votes}
          castVote={castVote}
        />
      </div>
    </div>
  );
}
