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
  SidebarMenuSubItem,
} from "../ui/sidebar";
import { ChevronRightIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import Link from "next/link";

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
  return (
    
    <SidebarGroup>
      {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item , i) => {
            const hasSub = item.subItems && item.subItems.length > 0;
            const isActive = currentPath === item.href;
            return (
              <SidebarMenuItem key={item.href}>
                {hasSub ? (
                  <Collapsible className="group/collapsible">
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton  tooltip={item.title}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRightIcon className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.subItems?.map((sub, i) => (
                          <SidebarMenuSubItem key={i}>
                            <SidebarMenuSubButton asChild isActive={isActive}>
                              <Link href={sub.href}>{sub.title}</Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
                  <SidebarMenuButton tooltip={item.title} className={isActive ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear" : ""} asChild>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default SidebarMain;
