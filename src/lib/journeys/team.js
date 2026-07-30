import { LayoutDashboard } from "lucide-react";
import { steps } from "@/lib/steps";
import { stepTasks } from "@/lib/stepTasks";
import { tours } from "@/lib/tours";
import PreparePanel from "@/components/panels/PreparePanel";
import LaunchPanel from "@/components/panels/LaunchPanel";
import DiscoverPanel from "@/components/panels/DiscoverPanel";
import AwarenessPanel from "@/components/panels/AwarenessPanel";
import BelongingPanel from "@/components/panels/BelongingPanel";
import ActionPanel from "@/components/panels/ActionPanel";

// The original journey. Prepare and Launch are the manager's setup work, so
// team members join at Discover.
export const teamJourney = {
  id: "journey",
  label: "Journey",
  navLabel: "Team journey",
  icon: LayoutDashboard,
  steps,
  stepTasks,
  tours,
  panels: {
    prepare: PreparePanel,
    launch: LaunchPanel,
    discover: DiscoverPanel,
    awareness: AwarenessPanel,
    belonging: BelongingPanel,
    action: ActionPanel,
  },
  hiddenForMember: ["prepare", "launch"],
  visibleFor: () => true,
};
