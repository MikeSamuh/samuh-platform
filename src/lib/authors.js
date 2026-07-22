import { BOARD_COLORS } from "@/lib/boardShapes";

export function getAuthors(members) {
  return members.map((name, i) => ({ name, color: BOARD_COLORS[i % BOARD_COLORS.length] }));
}
