"use client";

import { BookOpen, Bell, Link2, Activity } from "lucide-react";
import styles from "./IconRail.module.css";

export default function IconRail({
  view = "journey",
  onSelectView,
  showAdmin = false,
  journeyItems = [],
}) {
  const topItems = [
    ...journeyItems.map((j) => ({ id: j.id, icon: j.icon, label: j.label })),
    { id: "kit", icon: BookOpen, label: "Ritual Keeper Kit" },
    { id: "notifications", icon: Bell, label: "Notifications" },
    ...(showAdmin ? [{ id: "surveys", icon: Link2, label: "Link surveys" }] : []),
  ];
  const bottomItems = showAdmin
    ? [{ id: "admin", icon: Activity, label: "Team progress", tour: "admin" }]
    : [];

  function renderItem({ id, icon: Icon, label, tour }) {
    return (
      <button
        key={id}
        type="button"
        className={styles.item}
        data-active={view === id}
        data-tour={tour}
        aria-label={label}
        title={label}
        onClick={() => onSelectView?.(id)}
      >
        <span className={styles.itemIcon}>
          <Icon size={18} strokeWidth={1.75} />
        </span>
        <span className={styles.itemLabel}>{label}</span>
      </button>
    );
  }

  return (
    <div className={styles.railHolder}>
      <nav className={styles.rail} aria-label="Primary">
        {topItems.map(renderItem)}
        <div className={styles.spacer} />
        {bottomItems.map(renderItem)}
      </nav>
    </div>
  );
}
