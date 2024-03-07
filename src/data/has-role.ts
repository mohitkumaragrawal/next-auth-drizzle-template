import { Session } from "next-auth";

export default function hasRole(session: Session | undefined, role: string) {
  if (!session) return false;
  const roles = [...session.user?.role] ?? [];
  return roles.includes(role);
}
