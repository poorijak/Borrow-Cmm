"use client";

import React from "react";
import { useGetCategoryDetail } from "../hooks/useSubCate";
import BreadcrumLink from "@/components/shared/breadcrumb-link";

interface SubHeaderProps {
  id: string;
}

const SubHeader = ({ id }: SubHeaderProps) => {
  const { data } = useGetCategoryDetail(id);

  const breadcrumb = [
    {
      label: "Dashboard",
      href: "/admin",
    },
    {
      label: "หมวดหมู่",
      href: "/admin/category",
    },
  ];

  return (
    <div className="space-y-5">
      <BreadcrumLink items={breadcrumb} page={data?.title} />
      <header className="flex gap-4">
        <h2 className="text-3xl font-bold">{data?.title}</h2>
      </header>
    </div>
  );
};

export default SubHeader;
