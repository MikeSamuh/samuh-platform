"use client";

import { useState } from "react";
import { steps } from "@/lib/steps";
import IconRail from "@/components/IconRail";
import PathNavigator from "@/components/PathNavigator";
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
  const [activeStepId, setActiveStepId] = useState(steps[0].id);
  const ActivePanel = panels[activeStepId];

  return (
    <div className={styles.shell}>
      <IconRail />
      <div className={styles.main}>
        <div className={styles.header}>
          <span className={styles.headerTitle}>QOS Networks</span>
          <span className={styles.headerSub}>Samuh team journey</span>
        </div>
        <PathNavigator activeStepId={activeStepId} onSelect={setActiveStepId} />
        <ActivePanel />
      </div>
    </div>
  );
}
