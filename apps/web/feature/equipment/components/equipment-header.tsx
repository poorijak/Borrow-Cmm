import BreadcrumLink from "@/components/shared/breadcrumb-link";
import React from "react";

interface EquipmentHeaderProps {
  title: string | undefined;
}

const EquipmentHeader = ({ title }: EquipmentHeaderProps) => {
  const breadcrumb = [
    {
      label: "หน้าแรก",
      href: "/",
    },
    {
      label: "หมวดหมู่อุปกรณ์",
      href: "/equipment",
    },
  ];
  return (
    <div className="mb-10 h-44">
      <BreadcrumLink items={breadcrumb} page={title} />
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-primary text-center text-5xl font-bold">{title}</p>
      </div>
    </div>
  );
};

export default EquipmentHeader;
