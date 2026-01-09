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
import Link from "next/link";

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
            <Link href="/bag">
              <ShoppingBag className="size-5 text-muted-foreground" />
            </Link>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(type === "Admin" ? "md:hidden" : "block")}
            >
              <div className="cursor-pointer">
                <Avatar>
                  <AvatarImage src={user.profileImage} />
                </Avatar>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="text-red-500 cursor-pointer"
                onClick={() => signOut()}
              >
                <span>Sign Out</span>
              </DropdownMenuItem>
              {user.role === "Administrater" && (
                <DropdownMenuItem asChild>
                  <Link href="/admin">หลังบ้าน</Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;
