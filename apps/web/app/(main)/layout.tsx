import SiteHeader from "@/components/sidebar/site-header";
import { AppSidebar } from "@/components/ui/appSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getUser } from "@/feature/users/server/user";
import { User } from "@repo/types";
import { redirect } from "next/navigation";
import React from "react";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = async ({ children }: MainLayoutProps) => {
  const user: User = await getUser();

  if (!user) redirect("/auth/signin");
  

  return (
    <SidebarProvider>
      <AppSidebar type="Student" />
      <div className="flex w-full flex-col">
        <SiteHeader user={user} type="Student" />
        <div className="p-5">
          <main>{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
