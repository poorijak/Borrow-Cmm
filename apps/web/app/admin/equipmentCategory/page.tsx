import CategoriesList from "@/feature/admin/equipmentCategory/components/categoies-list";
import CategoryHeader from "@/feature/admin/equipmentCategory/components/category-header";
import React from "react";

const page = () => {
  return (
    <div>
      <CategoryHeader />
      <CategoriesList />
    </div>
  );
};

export default page;
