import Instructions from "@/components/Instructions";
import styles from "./Panel.module.css";

const instructions = `
1. Join peer-to-peer support.
2. Communicate your results with your team.
3. Understand your results.
`;

export default function AwarenessPanel() {
  return (
    <div className={styles.panel}>
      <div className={styles.placeholder}>
        Team environment + team practices charts will render here.
      </div>
      <Instructions markdown={instructions} />
    </div>
  );
}
