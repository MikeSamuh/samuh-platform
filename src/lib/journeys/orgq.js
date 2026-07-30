import { Building2 } from "lucide-react";
import { orgqSteps } from "@/lib/orgq/steps";
import { orgqStepTasks } from "@/lib/orgq/stepTasks";
import { orgqTours } from "@/lib/orgq/tours";
import OrgPreparePanel from "@/components/panels/orgq/OrgPreparePanel";
import OrgLaunchPanel from "@/components/panels/orgq/OrgLaunchPanel";
import OrgResultsPanel from "@/components/panels/orgq/OrgResultsPanel";
import OrgActionPanel from "@/components/panels/orgq/OrgActionPanel";
import OrgClosingPanel from "@/components/panels/orgq/OrgClosingPanel";

// The org-wide journey. Managers only — every step is org rollout work, and
// team members' whole experience is the team journey, which already starts them
// at Discover. Samuh staff are excluded too: they belong to no team, so RLS
// rejects every write they'd make here.
export const orgqJourney = {
  id: "orgq",
  label: "OrgQ Journey",
  navLabel: "OrgQ journey",
  icon: Building2,
  steps: orgqSteps,
  stepTasks: orgqStepTasks,
  tours: orgqTours,
  panels: {
    "orgq-prepare": OrgPreparePanel,
    "orgq-launch": OrgLaunchPanel,
    "orgq-results": OrgResultsPanel,
    "orgq-action": OrgActionPanel,
    "orgq-closing": OrgClosingPanel,
  },
  hiddenForMember: [],
  visibleFor: ({ isManager }) => isManager,
};
