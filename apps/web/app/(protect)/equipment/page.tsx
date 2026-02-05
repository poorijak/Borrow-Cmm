import BreadcrumLink from "@/components/shared/breadcrumb-link";
import CategorySelector from "@/feature/equipment/components/category-selector";
import React from "react";

const page = () => {
  const breadcrumb = [
    {
      label: "หน้าแรก",
      href: "/",
    },
  ];
  return (
    <div className="space-y-5">
      <BreadcrumLink items={breadcrumb} page="หมวดหมู่อุปกรณ์"/>
      <h1 className="text-3xl font-bold">หมวดหมู่อุปกรณ์</h1>
      <CategorySelector />
    </div>
  );
};

export default page;
