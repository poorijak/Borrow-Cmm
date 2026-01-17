import { Separator } from "@/components/ui/separator";
import SubCategoryForm from "@/feature/admin/subCategory/components/sub-category-form";
import SubCategoryList from "@/feature/admin/subCategory/components/sub-category-list";
import SubHeader from "@/feature/admin/subCategory/components/sub-header";
import React from "react";

interface CategoryDetailPageProps {
  params: { id: string };
  searchParams: Promise<{ page?: string }>;
}
const page = async ({ params, searchParams }: CategoryDetailPageProps) => {
  const { id } = await params;
  const page = parseInt((await searchParams).page || "1");

  return (
    <div className="space-y-7">
      <SubHeader id={id} />
      <Separator />
      <div className="grid grid-cols-1 gap-10 md:grid-cols-7 ">
        <div className="col-span-1  md:col-span-2">
          <SubCategoryForm id={id} />
        </div>
        <div className="col-span-1  md:col-span-5">
          <SubCategoryList id={id} page={page} />
        </div>
      </div>
    </div>
  );
};

export default page;
