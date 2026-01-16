import { Separator } from "@/components/ui/separator";
import SubCategoryForm from "@/feature/admin/subCategory/components/sub-category-form";
import SubHeader from "@/feature/admin/subCategory/components/sub-header";
import React from "react";

interface CategoryDetailPageProps {
  params: { id: string };
}
const page = async ({ params }: CategoryDetailPageProps) => {
  const { id } = await params;

  return (
    <div className="space-y-7">
      <SubHeader id={id} />
      <Separator />
      <SubCategoryForm id={id} />
    </div>
  );
};

export default page;
