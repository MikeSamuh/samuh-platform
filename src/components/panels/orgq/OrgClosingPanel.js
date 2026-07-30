"use client";

import { CalendarClock, Rocket } from "lucide-react";
import MediaAccordion from "@/components/MediaAccordion";
import CoachingCard from "@/components/CoachingCard";
import TeamJourneyReview from "@/components/orgq/TeamJourneyReview";
import BenchmarkCompare from "@/components/orgq/BenchmarkCompare";
import FeatureNote from "@/components/orgq/FeatureNote";
import { orgqClosingMedia } from "@/lib/orgq/media";
import { bookingLinks } from "@/lib/bookingLinks";
import panelStyles from "../Panel.module.css";

export default function OrgClosingPanel({ team, completeTask }) {
  return (
    <div className={panelStyles.panel}>
      <TeamJourneyReview taskChecks={team.taskChecks} />

      <BenchmarkCompare />

      <div data-tour="media">
        <MediaAccordion
          items={orgqClosingMedia}
          onItemOpened={(id) => completeTask("orgq-closing", id)}
        />
      </div>

      <div data-tour="booking">
        <CoachingCard
          icon={CalendarClock}
          title="Plan the next cycle"
          sub="What to repeat, what to change, and when to run OrgQ again"
          buttonLabel="Book a planning session"
          href={bookingLinks.ongoingSupport}
          onOpen={() => completeTask("orgq-closing", "next-cycle")}
        />
      </div>

      <CoachingCard
        icon={Rocket}
        title="Launch the next TeamQ"
        sub="Starts the team journey cycle again for the teams you prioritised"
        missingLinkSub="Launch TeamQ from each team's own Launch step"
        buttonLabel="Launch TeamQ"
        href={null}
        onOpen={() => completeTask("orgq-closing", "launch-teamq")}
      />

      <FeatureNote
        title="Closing the cycle"
        points={[
          "TeamQ scores benchmark against the OrgQ baseline, so you can see what actually moved.",
          "The next cycle starts from where this one finished — the roster and cuts carry over.",
        ]}
      />
    </div>
  );
}
