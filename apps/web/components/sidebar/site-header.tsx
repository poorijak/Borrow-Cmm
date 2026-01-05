import React from "react";
import { SidebarTrigger } from "../ui/sidebar";
import { Avatar, AvatarImage } from "../ui/avatar";
import { ShoppingBag } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { User } from "@repo/types";
import { cn } from "@/lib/utils";

interface SiteHeaderProps {
  className?: string;
  user: User;
  type?: "Admin" | "Student";
}

const SiteHeader = ({ user, type = "Student" }: SiteHeaderProps) => {
  return (
    <header
      className={cn(
        "sticky top-0 z-10 w-full",
        type === "Admin" ? "border-none bg-transparent" : "border-b bg-white"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4">
        <SidebarTrigger />
        <div
          className={cn(
            "items-center gap-4",
            type === "Admin" ? "hidden" : "flex"
          )}
        >
          <ShoppingBag className="size-5 text-muted-foreground" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="size-8" asChild>
                <AvatarImage src={user.profileImage} alt="@shadcn" />
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;
