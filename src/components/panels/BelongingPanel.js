import Instructions from "@/components/Instructions";
import PracticeTiles from "@/components/belonging/PracticeTiles";
import styles from "./Panel.module.css";

const instructions = `
1. Open a practice tile to watch, read, or listen.
2. Run the practice with your team.
3. Reflect together on what surfaced.
`;

export default function BelongingPanel() {
  return (
    <div className={styles.panel}>
      <PracticeTiles />
      <Instructions markdown={instructions} />
    </div>
  );
}
