import React from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import Link from "next/link";

interface TabItem {
  name: string;
  value: string;
  key: string;
  href: string;
}

interface TabsMenuProps {
  tabItems: TabItem[];
  defaultValue?: string;
}

const TabsMenu = ({ tabItems, defaultValue }: TabsMenuProps) => {
  return (
    <div className="w-full">
      <Tabs
        defaultValue={defaultValue || tabItems[0]?.value}
        className="w-full border-b"
      >
        <TabsList className="relative flex-wrap -mb-px h-auto  justify-start rounded-none border-b border-slate-200 bg-transparent p-0">
          {tabItems.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="relative w-full rounded-none border-b-2  border-transparent bg-transparent px-5 py-3 text-sm font-medium text-slate-500 shadow-none transition-none 
              data-[state=active]:border-b-blue-500 data-[state=active]:text-blue-600 data-[state=active]:shadow-none"
              asChild
            >
              <Link href={tab.href}>{tab.name}</Link>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default TabsMenu;
