"use client";

import React from "react";
import { SidebarTrigger } from "../ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
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
import { useIsMobile } from "@/hooks/use-mobile";
import BagItems from "@/feature/bag/components/bag-items";
import { Separator } from "../ui/separator";
import { useGetMyBag } from "@/feature/bag/hooks/useMyBag";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { Button } from "../ui/button";

interface SiteHeaderProps {
  className?: string;
  user: User;
  type?: "Admin" | "Student";
}

const SiteHeader = ({ user, type = "Student" }: SiteHeaderProps) => {
  const { mutate: signOut } = useSignout();

  const { data } = useGetMyBag(user.id);

  console.log(user);

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
          {isMobile
            ? type === "Student" && (
                <div className="relative">
                  <Link href={"/bag"}>
                    <ShoppingBag className="text-muted-foreground size-5" />
                    {(data?.totalQty || 0) >= 1 && (
                      <div className="bg-primary absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full text-[10px] text-white">
                        {data && data?.totalQty > 99 ? "99+" : data?.totalQty}
                      </div>
                    )}
                  </Link>
                </div>
              )
            : type === "Student" && (
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <div className="relative">
                      <ShoppingBag className="text-muted-foreground size-5" />
                      {(data?.totalQty || 0) >= 1 && (
                        <div className="bg-primary absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full text-[10px] text-white">
                          {data && data?.totalQty > 99 ? "99+" : data?.totalQty}
                        </div>
                      )}
                    </div>
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
                  <AvatarImage
                    src={
                      user.profileImage ||
                      "/images/placeholder/no-picture-profile.webp"
                    }
                  />
                  <AvatarFallback className="font-bold">
                    {user.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
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
                  <Link href={"/admin"}>หลังบ้าน</Link>
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
