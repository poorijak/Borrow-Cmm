import { User } from "@repo/types";

export const hasRole = (user: User | null, targetRole: string) => {
  if (!user?.role) return false;
  return user.role === targetRole;
};
