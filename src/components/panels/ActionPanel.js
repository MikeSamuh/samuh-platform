import Instructions from "@/components/Instructions";
import styles from "./Panel.module.css";

const instructions = `
1. Arrange the 3D board to represent your team, then save the arrangement.
2. Fill out the collective worksheet together with sticky notes.
3. Discuss what the arrangement and the worksheet reveal.
`;

export default function ActionPanel() {
  return (
    <div className={styles.panel}>
      <div className={styles.placeholder}>
        3D object board + collective worksheet will render here.
      </div>
      <Instructions markdown={instructions} />
    </div>
  );
}
