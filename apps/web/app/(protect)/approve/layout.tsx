import { hasRole } from "@/feature/users/permission/user";
import { getUser } from "@/feature/users/server/user";
import { ROLES } from "@repo/types";
import { redirect } from "next/navigation";
import React from "react";

interface ApproveLayoutProps {
  children: React.ReactNode;
}

const layout = async ({ children }: ApproveLayoutProps) => {
  const user = await getUser();

  const instructor = hasRole(user, [ROLES.INSTRUCTOR]);

  return <div>{children}</div>;
};

export default layout;
