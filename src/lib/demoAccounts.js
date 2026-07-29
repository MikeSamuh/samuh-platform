// TESTING ONLY. The login screen is bypassed: the role dropdown signs into
// one of these shared demo accounts behind the scenes, so persistence and
// row-level security keep working unchanged. Remove this (and restore the
// AuthScreen flow from git history) before real teams use the platform.
export const demoAccounts = {
  manager: {
    label: "Manager",
    email: "manager@samuh.work",
    password: "SamuhDemo2026!",
  },
  member: {
    label: "Team Member",
    email: "member@samuh.work",
    password: "SamuhDemo2026!",
  },
  samuh_admin: {
    label: "Samuh Admin",
    email: "admin@samuh.work",
    password: "SamuhDemo2026!",
  },
};

export const DEFAULT_ROLE = "manager";
