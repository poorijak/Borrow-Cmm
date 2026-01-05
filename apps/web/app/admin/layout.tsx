import SiteHeader from "@/components/sidebar/site-header";
import { AppSidebar } from "@/components/ui/appSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { hasRole } from "@/feature/users/permission/user";
import { getUser } from "@/feature/users/server/user";
import { ROLES, User } from "@repo/types";
import { redirect } from "next/navigation";
import React from "react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = async ({ children }: AdminLayoutProps) => {
  const user: User = await getUser();

  if (!user) redirect("/auth/signin")

  const isAdmin = hasRole(user, ROLES.ADMIN);
  if (!isAdmin) redirect("/");

  return (
    <SidebarProvider>
      <AppSidebar type="Admin" user={user} />
      <div className="flex w-full flex-col">
        <SiteHeader user={user}  type="Admin"/>
        <div className="p-5">
          <main>{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
