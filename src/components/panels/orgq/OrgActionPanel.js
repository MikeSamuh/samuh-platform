"use client";

import { CalendarCheck, Users, Unlock } from "lucide-react";
import MediaAccordion from "@/components/MediaAccordion";
import CoachingCard from "@/components/CoachingCard";
import FeatureNote from "@/components/orgq/FeatureNote";
import { orgqActionMedia } from "@/lib/orgq/media";
import { bookingLinks } from "@/lib/bookingLinks";
import shared from "@/components/orgq/Orgq.module.css";
import panelStyles from "../Panel.module.css";

export default function OrgActionPanel({ team, completeTask }) {
  const opened = (team.taskChecks["orgq-action"] || []).includes("access");

  return (
    <div className={panelStyles.panel}>
      <div data-tour="access">
        <div className={shared.card}>
          <div className={shared.head}>
            <span className={shared.iconBox}>
              <Unlock size={17} />
            </span>
            <div className={shared.headText}>
              <div className={shared.title}>Open access at team-member level</div>
              <div className={shared.sub}>
                This is the handover: every person on the roster gets into their own team
                journey
              </div>
            </div>
          </div>
          <ul className={shared.guidance}>
            <li>
              Team members see the journey from <strong>Discover</strong> onwards —
              metaphor cards, results, belonging practices and the ritual they build
              together.
            </li>
            <li>
              Managers keep the Prepare and Launch steps, which are theirs to run for
              their own team.
            </li>
          </ul>
          <button
            type="button"
            className={shared.button}
            onClick={() => completeTask("orgq-action", "access")}
            disabled={opened}
          >
            {opened ? "Access opened" : "Open access to team members"}
          </button>
        </div>
      </div>

      <div data-tour="booking">
        <CoachingCard
          icon={CalendarCheck}
          title="Schedule your check-in"
          sub="Review progress with Samuh as the first journeys land"
          buttonLabel="Book a check-in"
          href={bookingLinks.coachingCall}
          onOpen={() => completeTask("orgq-action", "check-in")}
        />
      </div>

      <CoachingCard
        icon={Users}
        title="Organise the community meeting"
        sub="Bring leaders, ritual keepers and facilitators together to compare notes"
        buttonLabel="Book a session"
        href={bookingLinks.ongoingSupport}
        onOpen={() => completeTask("orgq-action", "community")}
      />

      <div data-tour="media">
        <MediaAccordion
          items={orgqActionMedia}
          onItemOpened={(id) => completeTask("orgq-action", id)}
        />
      </div>

      <FeatureNote
        title="Access model"
        points={[
          "Access opens at team-member level — everyone on the roster reaches their own team's journey, and nobody else's.",
        ]}
      />
    </div>
  );
}
