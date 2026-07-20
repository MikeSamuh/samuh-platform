import Instructions from "@/components/Instructions";
import styles from "./Panel.module.css";

const instructions = `
1. Identify a co-lead for the team.
2. Walk through the Samuh methodology and awareness.
3. Cover what the platform is and how to access it.
4. Show how to run a TeamQ and read results.
5. Go through the Keystone practices.
`;

export default function PreparePanel() {
  return (
    <div className={styles.panel}>
      <div className={styles.placeholder}>
        TeamQ visual + team members will render here.
      </div>
      <Instructions markdown={instructions} />
    </div>
  );
}
