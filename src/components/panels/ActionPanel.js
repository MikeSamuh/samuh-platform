import Instructions from "@/components/Instructions";
import Board3D from "@/components/action/Board3D";
import Worksheet from "@/components/action/Worksheet";
import styles from "./Panel.module.css";

const instructions = `
1. Use the 3D board to arrange and save perspectives.
2. Capture ideas together on the collective worksheet.
3. Turn shared insight into owned commitments.
`;

export default function ActionPanel({ members, currentMemberIndex, setCurrentMemberIndex }) {
  return (
    <div className={styles.panel}>
      <Board3D />
      <Worksheet
        members={members}
        currentMemberIndex={currentMemberIndex}
        setCurrentMemberIndex={setCurrentMemberIndex}
      />
      <Instructions markdown={instructions} />
    </div>
  );
}
