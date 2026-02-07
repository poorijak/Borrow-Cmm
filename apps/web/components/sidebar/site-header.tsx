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
import { useIsMobile } from "@/hooks/use-mobile";
import BagItems from "@/feature/bag/components/bag-items";
import { Separator } from "../ui/separator";

interface SiteHeaderProps {
  className?: string;
  user: User;
  type?: "Admin" | "Student";
}

const SiteHeader = ({ user, type = "Student" }: SiteHeaderProps) => {
  const { mutate: signOut } = useSignout();

  const isMobile = useIsMobile();

  return (
    <header
      className={cn(
        "sticky top-0 z-10 w-full border-b",
        type === "Admin" ? "bg-transparent md:border-none" : "bg-white",
      )}
    >
      <div className="flex h-16 items-center justify-between px-4">
        <SidebarTrigger />

        <div className="flex items-center gap-4">
          {}

          {isMobile ? (
            type === "Student" && (
              <Link href="/bag">
                <ShoppingBag className="text-muted-foreground size-5" />
              </Link>
            )
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <ShoppingBag className="text-muted-foreground size-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="h-[800px] w-[500px] space-y-5 p-5"
              >
                <h3 className="text-xl font-bold">กระเป๋าของฉัน</h3>
                <Separator />
                <BagItems userId={user.id} />
              </DropdownMenuContent>
            </DropdownMenu>
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
                className="cursor-pointer text-red-500"
                onClick={() => signOut()}
              >
                <span>Sign Out</span>
              </DropdownMenuItem>
              {(user.role === "administrater" || user.role === "moderater") && (
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
