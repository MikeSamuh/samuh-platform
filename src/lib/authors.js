import { MEMBER_COLORS } from "@/lib/colors";

// members: [{ id, name, email, tenure }]
export function getAuthors(members) {
  return members.map((m, i) => ({
    id: m.id,
    name: m.name,
    color: MEMBER_COLORS[i % MEMBER_COLORS.length],
  }));
}
