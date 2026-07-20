import Instructions from "@/components/Instructions";
import styles from "./Panel.module.css";

const instructions = `
1. Launch the TeamQ for your members.
2. Schedule discovery interviews.
3. Book one-on-one coaching sessions with Samuh.
`;

export default function LaunchPanel() {
  return (
    <div className={styles.panel}>
      <div className={styles.placeholder}>
        Launch TeamQ button + scheduling calendars will render here.
      </div>
      <Instructions markdown={instructions} />
    </div>
  );
}
