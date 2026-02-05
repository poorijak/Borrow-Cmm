"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import SidebarMain from "../sidebar/sidebar-main";
import { adminServices, studentService } from "../sidebar/sidebar-list";
import SideFooter from "../sidebar/sidebar-footer";
import { User } from "@repo/types";

interface AppSidebar {
  type: "Admin" | "Student";
  user?: User;
}

export function AppSidebar({ type, user }: AppSidebar) {
  const currentPath = usePathname();

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader className="p-5">
        <SidebarMenu>
          <SidebarMenuItem>
            <p className="truncate font-semibold group-data-[collapsible=icon]:hidden">
              {type === "Student" ? " บริการยืม/คืนอุปกรณ์" : "CMM ADMIN PANEL"}
            </p>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>หน้าหลัก</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="หน้าหลัก"
                  asChild
                  className={cn(
                    currentPath === "/" || currentPath === "/admin"
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
                      : "",
                  )}
                >
                  <Link href={type === "Student" ? "/" : "/admin"}>
                    <Home />
                    <span>หน้าหลัก</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {type === "Student"
          ? studentService.map((group, i) => (
              <SidebarMain
                items={group.items}
                key={i}
                label={group.label}
                currentPath={currentPath}
              />
            ))
          : adminServices.map((group, i) => (
              <SidebarMain
                key={i}
                label={group.label}
                items={group.items}
                currentPath={currentPath}
              />
            ))}
      </SidebarContent>

      {type === "Admin" && <SideFooter user={user} />}
    </Sidebar>
  );
}
