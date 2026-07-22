"use client";

import { useState } from "react";
import { Play, Users, MessageCircle } from "lucide-react";
import Instructions from "@/components/Instructions";
import Calendar from "@/components/launch/Calendar";
import panelStyles from "./Panel.module.css";
import styles from "./LaunchPanel.module.css";

const instructions = `
1. Launch the TeamQ for your members.
2. Schedule discovery interviews on the calendar.
3. Book one-on-one coaching sessions with Samuh.
`;

export default function LaunchPanel({ members = [] }) {
  const [launched, setLaunched] = useState(false);
  const [bookings, setBookings] = useState([]);

  function toggleBooking(calendar, date) {
    setBookings((prev) => {
      const exists = prev.some((b) => b.calendar === calendar && b.date === date);
      if (exists) return prev.filter((b) => !(b.calendar === calendar && b.date === date));
      return [...prev, { calendar, date }];
    });
  }

  const discDates = new Set(bookings.filter((b) => b.calendar === "disc").map((b) => b.date));
  const coachDates = new Set(bookings.filter((b) => b.calendar === "coach").map((b) => b.date));

  return (
    <div className={panelStyles.panel}>
      {launched ? (
        <div className={styles.status}>
          TeamQ launched &middot; {members.length} of {members.length} invited, 0 responded
        </div>
      ) : (
        <button
          type="button"
          className={styles.launchButton}
          onClick={() => setLaunched(true)}
          disabled={members.length === 0}
        >
          <Play size={16} />
          Launch TeamQ
        </button>
      )}

      <div className={styles.calendars}>
        <Calendar
          title="Discovery interviews"
          icon={Users}
          accent="var(--accent)"
          bookedDates={discDates}
          onToggle={(date) => toggleBooking("disc", date)}
        />
        <Calendar
          title="1:1 coaching with Samuh"
          icon={MessageCircle}
          accent="var(--accent-purple)"
          bookedDates={coachDates}
          onToggle={(date) => toggleBooking("coach", date)}
        />
      </div>

      <Instructions markdown={instructions} />
    </div>
  );
}
