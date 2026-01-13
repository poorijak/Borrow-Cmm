import CategoriesList from "@/feature/admin/equipmentCategory/components/categoies-list";
import CategoryHeader from "@/feature/admin/equipmentCategory/components/category-header";
import { ActiveStatus } from "@repo/types";
import React from "react";

interface CateogoriesPageProps {
  searchParams: Promise<{ status?: string; page?: string }>;
}

const page = async ({ searchParams }: CateogoriesPageProps) => {
  const status = (await searchParams).status as ActiveStatus;
  const page = parseInt((await searchParams).page || "1");

  return (
    <div>
      <CategoryHeader />
      <CategoriesList status={status} page={page} />
    </div>
  );
};

export default page;
