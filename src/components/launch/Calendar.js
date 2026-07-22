"use client";

import styles from "./Calendar.module.css";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

function getMonthCells(year, month) {
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Array.from({ length: firstWeekday }, () => null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(day);
  return cells;
}

function toISODate(year, month, day) {
  const mm = String(month + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

export default function Calendar({ title, icon: Icon, accent, bookedDates, onToggle }) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const cells = getMonthCells(year, month);
  const monthLabel = today.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <Icon size={16} color={accent} strokeWidth={1.75} />
        <span className={styles.title}>{title}</span>
      </div>
      <div className={styles.subtitle}>
        {monthLabel} &middot; {bookedDates.size} scheduled
      </div>
      <div className={styles.grid}>
        {WEEKDAYS.map((wd, i) => (
          <div key={i} className={styles.weekday}>
            {wd}
          </div>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <div key={`blank-${i}`} />;
          const iso = toISODate(year, month, day);
          const on = bookedDates.has(iso);
          return (
            <button
              key={iso}
              type="button"
              className={styles.day}
              data-on={on}
              style={on ? { background: accent } : undefined}
              onClick={() => onToggle(iso)}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
