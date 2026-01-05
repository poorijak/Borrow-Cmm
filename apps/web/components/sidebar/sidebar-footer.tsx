import React from "react";
import { SidebarFooter, SidebarMenu, SidebarMenuItem } from "../ui/sidebar";
import { Avatar, AvatarImage } from "../ui/avatar";
import { User } from "@repo/types";
import { Button } from "../ui/button";
import { Home, LogOut } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import Link from "next/link";

interface SideFooterProps {
  user: User | undefined;
}

const SideFooter = ({ user }: SideFooterProps) => {
  return (
    <SidebarFooter className="p-5">
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span className="font-bold text-sm">{user?.role}</span>
                <span className="text-muted-foreground text-xs">
                  {user?.email}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" asChild>
                    <Link href={"/"}>
                      <Home />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>หน้าหลัก</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" >
                    <LogOut />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>ออกจากระบบ</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
};

export default SideFooter;
