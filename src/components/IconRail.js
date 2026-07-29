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
  { id: "dashboard", icon: LayoutDashboard, label: "Journey" },
  { id: "world", icon: Globe, label: "World" },
  { id: "shield", icon: Shield, label: "Shield" },
  { id: "frame", icon: Frame, label: "Frame" },
];

const railIconsBottom = [
  { id: "activity", icon: Activity, label: "Team progress" },
  { id: "settings", icon: Settings, label: "Settings" },
];

export default function IconRail({ view = "journey", onSelectView, showAdmin = false }) {
  function activeFor(id) {
    if (id === "dashboard") return view === "journey";
    if (id === "activity") return view === "admin";
    return false;
  }

  function handleClick(id) {
    if (id === "dashboard") onSelectView?.("journey");
    if (id === "activity") onSelectView?.("admin");
  }

  return (
    <nav className={styles.rail} aria-label="Primary">
      {railIcons.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          type="button"
          className={styles.iconButton}
          data-active={activeFor(id)}
          aria-label={label}
          title={label}
          onClick={() => handleClick(id)}
        >
          <Icon size={18} strokeWidth={1.75} />
        </button>
      ))}
      <div className={styles.spacer} />
      {railIconsBottom
        .filter(({ id }) => id !== "activity" || showAdmin)
        .map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            type="button"
            className={styles.iconButton}
            data-active={activeFor(id)}
            data-tour={id === "activity" ? "admin" : undefined}
            aria-label={label}
            title={label}
            onClick={() => handleClick(id)}
          >
            <Icon size={18} strokeWidth={1.75} />
          </button>
        ))}
    </nav>
  );
}
