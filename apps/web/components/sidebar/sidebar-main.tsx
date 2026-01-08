"use client";

import React from "react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
} from "../ui/sidebar";
import { ChevronRightIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SidebarItem {
  title: string;
  href: string;
  icon?: any;
  subItems?: SidebarItem[];
}

interface SidebarMainProps {
  currentPath: string;
  items: SidebarItem[];
  label?: string;
}

const SidebarMain = ({ currentPath, label, items }: SidebarMainProps) => {
  const isChildActive = (item: SidebarItem): boolean => {
    if (currentPath === item.href) return true;
    if (item.subItems) {
      return item.subItems.some((sub) => isChildActive(sub));
    }
    return false;
  };

  const renderMenuItems = (item: SidebarItem, isSub: boolean = false) => {
    const hasSub = item.subItems && item.subItems.length > 0;
    const isActive = currentPath === item.href;
    const childActive = isChildActive(item);

    if (hasSub) {
      return (
        <Collapsible
          key={item.title + item.href}
          asChild
          defaultOpen={childActive}
          className="group/collapsible"
        >
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              {isSub ? (
                <SidebarMenuSubButton className="cursor-pointer">
                  <span>{item.title}</span>
                  <ChevronRightIcon className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuSubButton>
              ) : (
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRightIcon className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              )}
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {item.subItems?.map((sub) => renderMenuItems(sub, true))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      );
    }

    // กรณีไม่มี Sub-items (Leaf Node)
    return (
      <SidebarMenuItem key={item.href}>
        {isSub ? (
          <SidebarMenuSubButton asChild isActive={isActive}>
            <Link href={item.href}>{item.title}</Link>
          </SidebarMenuSubButton>
        ) : (
          <SidebarMenuButton
            tooltip={item.title}
            isActive={isActive}
            className={cn(
              isActive &&
                "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
            asChild
          >
            <Link href={item.href}>
              {item.icon && <item.icon />}
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        )}
      </SidebarMenuItem>
    );
  };

  return (
    <SidebarGroup>
      {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>{items.map((item) => renderMenuItems(item))}</SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default SidebarMain;
