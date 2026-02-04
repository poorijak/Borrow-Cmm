import { User } from "@repo/types";

export const hasRole = (user: User | null, targetRole: string[] | string) => {
  if (!user?.role) return false;
  return targetRole.includes(user.role);
};
