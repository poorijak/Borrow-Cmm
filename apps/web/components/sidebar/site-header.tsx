"use client";

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
import { useSignout } from "@/feature/auth/hooks/useAuth";

interface SiteHeaderProps {
  className?: string;
  user: User;
  type?: "Admin" | "Student";
}

const SiteHeader = ({ user, type = "Student" }: SiteHeaderProps) => {
  const { mutate: signOut } = useSignout();

  return (
    <header
      className={cn(
        "sticky top-0 z-10 border-b w-full",
        type === "Admin" ? " md:border-none  bg-transparent" : " bg-white"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4">
        <SidebarTrigger />
        <div className="flex items-center gap-4">
          {type === "Student" && (
            <ShoppingBag className="size-5 text-muted-foreground" />
          )}
          <DropdownMenu>
            <DropdownMenuTrigger className="block md:hidden">
              <div className="cursor-pointer">
                <Avatar className="size-8">
                  <AvatarImage src={user.profileImage} alt={user.name} />
                </Avatar>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="text-red-500 cursor-pointer"
                onClick={() => signOut()}
              >
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;
