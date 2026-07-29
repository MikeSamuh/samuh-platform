"use client";

import styles from "./MemberSelectCard.module.css";

export default function MemberSelectCard({
  icon: Icon,
  title,
  sub,
  members,
  value,
  onChange,
  placeholder = "Choose a team member",
}) {
  return (
    <div className={styles.card}>
      <div className={styles.info}>
        {Icon && (
          <span className={styles.iconBox}>
            <Icon size={17} />
          </span>
        )}
        <span>
          <div className={styles.title}>{title}</div>
          {sub && <div className={styles.sub}>{sub}</div>}
        </span>
      </div>
      <select
        className={styles.select}
        value={value || ""}
        onChange={(e) => onChange(e.target.value || null)}
      >
        <option value="">{placeholder}</option>
        {members.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </select>
    </div>
  );
}
