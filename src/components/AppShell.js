"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useAuth } from "@/lib/AuthContext";
import { useTeamData } from "@/lib/useTeamData";
import { journeys, journeyList, isJourneyView } from "@/lib/journeys";
import { visibleStepsFor } from "@/lib/journeys/progress";
import IconRail from "@/components/IconRail";
import JourneyView from "@/components/JourneyView";
import AdminDashboard from "@/components/AdminDashboard";
import ReadinessKit from "@/components/views/ReadinessKit";
import Notifications from "@/components/views/Notifications";
import SurveyLinks from "@/components/views/SurveyLinks";
import TeamName from "@/components/TeamName";
import RoleSwitcher from "@/components/RoleSwitcher";
import styles from "./AppShell.module.css";

// Where each person last was, so a refresh doesn't send them back to step one.
// Keyed per profile so switching roles doesn't inherit the other's place.
const navKey = (profileId) => `ritualizer:nav:${profileId}`;

function readSavedNav(profileId) {
  if (!profileId || typeof window === "undefined") return null;
  try {
    const raw = JSON.parse(window.localStorage.getItem(navKey(profileId)));
    if (!raw) return null;
    // v1 stored a single `activeStepId`, back when there was only one journey.
    if (!raw.steps) {
      return {
        view: raw.view,
        steps: raw.activeStepId ? { journey: raw.activeStepId } : {},
      };
    }
    return raw;
  } catch {
    return null;
  }
}

const STATIC_VIEWS = ["kit", "notifications"];
const STAFF_VIEWS = ["admin", "surveys"];

export default function AppShell() {
  const { profile, isStaff, isManager } = useAuth();
  const team = useTeamData(profile?.team_id, profile?.id);

  const roles = { isManager, isStaff };

  // One rule for who may open what, consulted by the rail, the click guard and
  // the saved-view restore — so a hidden rail item can't be reached by a stale
  // localStorage value.
  function canOpenView(id) {
    if (STATIC_VIEWS.includes(id)) return true;
    if (STAFF_VIEWS.includes(id)) return isStaff;
    if (isJourneyView(id)) return journeys[id].visibleFor(roles);
    return false;
  }

  const defaultStepFor = (journey) => visibleStepsFor(journey, roles)[0].id;
  const defaultView = isStaff ? "admin" : "journey";

  const [stepByJourney, setStepByJourney] = useState(() =>
    Object.fromEntries(journeyList.map((j) => [j.id, j.steps[0].id]))
  );
  const [view, setView] = useState(defaultView);

  // Restore the last place on load / profile switch, falling back to the
  // sensible default for the role. Waits for team data so a restored step isn't
  // rejected by unlock rules that haven't loaded yet.
  useEffect(() => {
    if (!profile?.id || team.loading) return;
    const saved = readSavedNav(profile.id);

    setView(saved?.view && canOpenView(saved.view) ? saved.view : defaultView);
    setStepByJourney(
      Object.fromEntries(
        journeyList.map((j) => {
          const savedStep = saved?.steps?.[j.id];
          const allowed = visibleStepsFor(j, roles).some((s) => s.id === savedStep);
          return [j.id, allowed ? savedStep : defaultStepFor(j)];
        })
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id, isStaff, isManager, team.loading]);

  // Remember it whenever it changes.
  useEffect(() => {
    if (!profile?.id || team.loading) return;
    try {
      window.localStorage.setItem(
        navKey(profile.id),
        JSON.stringify({ view, steps: stepByJourney })
      );
    } catch {
      // Private-mode storage failures shouldn't break navigation.
    }
  }, [profile?.id, view, stepByJourney, team.loading]);

  function selectView(id) {
    if (!canOpenView(id)) return;
    setView(id);
  }

  function selectStep(journeyId, stepId) {
    setStepByJourney((m) => ({ ...m, [journeyId]: stepId }));
  }

  if (team.loading && !isStaff) return null;

  const activeJourney = isJourneyView(view) && canOpenView(view) ? journeys[view] : null;

  return (
    <div className={styles.shell}>
      <IconRail
        view={view}
        onSelectView={selectView}
        showAdmin={isStaff}
        journeyItems={journeyList.filter((j) => j.visibleFor(roles))}
      />
      <div className={styles.main}>
        <div className={styles.header}>
          <div className={styles.brand}>
            <Image
              src="/samuh-logo.png"
              alt="Samuh"
              width={140}
              height={45}
              className={styles.logo}
              priority
            />
            <span className={styles.appTitle}>Ritualizer</span>
          </div>
          <div className={styles.account}>
            {!isStaff && (
              <TeamName team={team.team} canRename={isManager} onRename={team.renameTeam} />
            )}
            <RoleSwitcher currentRole={profile?.role} />
          </div>
        </div>

        {team.error && (
          <div className={styles.errorBar} role="alert">
            <span>{team.error}</span>
            <button type="button" className={styles.errorDismiss} onClick={team.dismissError}>
              Dismiss
            </button>
          </div>
        )}

        {view === "kit" ? (
          <ReadinessKit team={team} isStaff={isStaff} />
        ) : view === "notifications" ? (
          <Notifications team={team} isStaff={isStaff} />
        ) : view === "surveys" && isStaff ? (
          <SurveyLinks />
        ) : view === "admin" && isStaff ? (
          <AdminDashboard />
        ) : isStaff ? (
          // Samuh staff belong to no team, so the journey has nothing to read
          // or write. Say so instead of showing an empty, silently-failing form.
          <div className={styles.staffNotice}>
            <div className={styles.staffNoticeTitle}>You&apos;re viewing as Samuh Admin</div>
            <p className={styles.staffNoticeBody}>
              Staff accounts aren&apos;t part of any client team, so there&apos;s no journey to
              fill in here. Use the team progress dashboard to see how every client team is
              doing, or switch to Manager or Team Member in the dropdown to walk the journey.
            </p>
            <button
              type="button"
              className={styles.staffNoticeButton}
              onClick={() => setView("admin")}
            >
              Go to team progress
            </button>
          </div>
        ) : activeJourney ? (
          <JourneyView
            key={activeJourney.id}
            journey={activeJourney}
            team={team}
            isManager={isManager}
            isStaff={isStaff}
            activeStepId={stepByJourney[activeJourney.id]}
            onSelectStep={(stepId) => selectStep(activeJourney.id, stepId)}
          />
        ) : null}
      </div>
    </div>
  );
}
