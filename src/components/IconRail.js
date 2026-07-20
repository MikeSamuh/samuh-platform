"use client";

import {
  Menu,
  LayoutDashboard,
  Globe,
  Shield,
  Frame,
  Settings,
  Activity,
} from "lucide-react";
import styles from "./IconRail.module.css";

const railIcons = [
  { id: "menu", icon: Menu, label: "Menu" },
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "world", icon: Globe, label: "World" },
  { id: "shield", icon: Shield, label: "Shield" },
  { id: "frame", icon: Frame, label: "Frame" },
];

const railIconsBottom = [
  { id: "activity", icon: Activity, label: "Activity" },
  { id: "settings", icon: Settings, label: "Settings" },
];

export default function IconRail() {
  return (
    <nav className={styles.rail} aria-label="Primary">
      {railIcons.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          type="button"
          className={styles.iconButton}
          data-active={id === "dashboard"}
          aria-label={label}
          title={label}
        >
          <Icon size={18} strokeWidth={1.75} />
        </button>
      ))}
      <div className={styles.spacer} />
      {railIconsBottom.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          type="button"
          className={styles.iconButton}
          aria-label={label}
          title={label}
        >
          <Icon size={18} strokeWidth={1.75} />
        </button>
      ))}
    </nav>
  );
}
