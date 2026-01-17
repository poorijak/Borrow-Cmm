"use client";

import TabsMenu from "@/components/shared/tabsMenu";
import { usePathname } from "next/navigation";
import React from "react";

const EquipmentList = () => {
  const pathName = usePathname();

  console.log(pathName);

  const tabs = [
    {
      name: "ทั้งหมด",
      key: "All",
      value: "all",
      defaultValue: true,
      href: `${pathName}`,
    },
    {
      name: "เปิดใช้งาน",
      key: "Active",
      value: "Active",
      href: `${pathName}?status=active`,
    },
    {
      name: "ปิดใช้งาน",
      key: "Inactive",
      value: "Inactive",
      href: `${pathName}?status=inactive`,
    },
  ];
  return (
    <div>
      <TabsMenu tabItems={tabs} />
    </div>
  );
};

export default EquipmentList;
