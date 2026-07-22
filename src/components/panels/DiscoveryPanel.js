import Instructions from "@/components/Instructions";
import TeamQVisual from "@/components/discovery/TeamQVisual";
import TeamMembers from "@/components/discovery/TeamMembers";
import styles from "./Panel.module.css";

const instructions = `
1. Identify a co-lead for the team.
2. Walk through the Samuh methodology and awareness.
3. Cover what the platform is and how to access it.
4. Show how to run a TeamQ and read results.
5. Go through the Keystone practices.
`;

export default function DiscoveryPanel({ members, addMember, removeMember }) {
  return (
    <div className={styles.panel}>
      <TeamQVisual />
      <Instructions markdown={instructions} />
      <TeamMembers members={members} onAdd={addMember} onRemove={removeMember} />
    </div>
  );
}
