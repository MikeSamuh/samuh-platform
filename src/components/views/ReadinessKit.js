"use client";

import MediaAccordion from "@/components/MediaAccordion";
import styles from "./Views.module.css";

const kitResources = [
  {
    id: "keeper-guide",
    name: "The Ritual Keeper handbook",
    type: "pdf",
    meta: "What the role is and how to hold it well",
    src: null,
  },
  {
    id: "first-month",
    name: "Your first month as keeper",
    type: "pdf",
    meta: "A week-by-week starter plan",
    src: null,
  },
  {
    id: "handover",
    name: "Handing over at three months",
    type: "pdf",
    meta: "Rotating the role without losing momentum",
    src: null,
  },
];

const faq = [
  {
    q: "What exactly does a ritual keeper do?",
    a: "You make sure the practice actually happens: you hold the calendar slot, open and close the ritual, and notice when it starts to drift. You're a steward, not an enforcer — the ritual belongs to the whole team.",
  },
  {
    q: "How long is the role?",
    a: "Three months, then it rotates to a new pair. Keeping the term short keeps the energy fresh and spreads ownership across the team.",
  },
  {
    q: "Why are there two keepers?",
    a: "Two keepers share the load, cover each other's absences, and keep each other honest. One person alone tends to either burn out or become 'the ritual police'.",
  },
  {
    q: "What if the team stops showing up?",
    a: "Name it early and kindly — usually in the ritual itself. If attendance keeps slipping, that's a signal to revisit the canvas: the design may need to change, and that's normal.",
  },
  {
    q: "What happens at the end of three months?",
    a: "Run a short handover with the incoming pair: what worked, what drifted, what you'd change. The handover guide above walks you through it.",
  },
];

const prompts = [
  "What did the ritual make possible this month that wouldn't have happened otherwise?",
  "When did the ritual feel most alive? When did it feel like going through the motions?",
  "Who hasn't spoken much lately, and what would make it easier for them?",
  "If we could change one thing about the ritual next month, what would it be?",
];

export default function ReadinessKit({ team, isStaff }) {
  return (
    <div className={styles.panel}>
      <span className={styles.eyebrow}>Ritual Keeper Readiness Kit</span>

      <div className={styles.card}>
        <div className={styles.cardTitle}>Guides</div>
        <div className={styles.cardSub}>
          Everything a new keeper needs — start with the handbook.
        </div>
        <MediaAccordion items={kitResources} />
      </div>

      <div className={styles.card}>
        <div className={styles.cardTitle}>FAQ</div>
        {faq.map(({ q, a }) => (
          <details key={q} className={styles.faqItem}>
            <summary>{q}</summary>
            <div className={styles.faqAnswer}>{a}</div>
          </details>
        ))}
      </div>

      <div className={styles.card}>
        <div className={styles.cardTitle}>Reflection prompts</div>
        <div className={styles.cardSub}>
          Bring one of these to the ritual, or to your keeper check-ins.
        </div>
        <div className={styles.prompts}>
          {prompts.map((p) => (
            <div key={p} className={styles.prompt}>
              {p}
            </div>
          ))}
        </div>
      </div>

      {!isStaff && (
        <div className={styles.card}>
          <div className={styles.cardTitle}>Feedback emails</div>
          <div className={styles.cardSub}>
            Send the keepers a regular email asking how the ritual is going, with a
            reflection prompt to bring to the team.
          </div>
          <div className={styles.cadenceRow}>
            <select
              className={styles.select}
              value={team.feedbackCadence}
              onChange={(e) => team.setFeedbackCadence(e.target.value)}
            >
              <option value="off">Off</option>
              <option value="biweekly">Every two weeks</option>
              <option value="monthly">Once a month</option>
            </select>
          </div>
          <div className={styles.hint}>
            Your preference is saved. Sending activates once an email provider is connected
            to the platform — no emails go out until then.
          </div>
        </div>
      )}
    </div>
  );
}
