import { Separator } from "@/components/ui/separator";
import EquipmentHeader from "@/feature/admin/equipment/components/equipement-header";
import EquipmentList from "@/feature/admin/equipment/components/equipment-list";
import SubCategoryForm from "@/feature/admin/subCategory/components/sub-category-form";
import SubCategoryList from "@/feature/admin/subCategory/components/sub-category-list";
import SubHeader from "@/feature/admin/subCategory/components/sub-header";
import { ActiveStatus } from "@repo/types";
import React from "react";

interface CategoryDetailPageProps {
  params: { id: string };
  searchParams: Promise<{ subPage?: string; eqPage: string; status?: string }>;
}
const page = async ({ params, searchParams }: CategoryDetailPageProps) => {
  const { id } = await params;
  const subPage = parseInt((await searchParams).subPage || "1");
  const eqPage = parseInt((await searchParams).eqPage || "1");
  const status = (await (await searchParams).status) as ActiveStatus;

  return (
    <div className="space-y-7">
      <SubHeader id={id} />
      <Separator />
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-7">
        <div className="col-span-1 lg:col-span-2">
          <SubCategoryForm id={id} />
        </div>
        <div className="col-span-1 lg:col-span-5">
          <SubCategoryList id={id} page={subPage} />
        </div>
      </div>
      <Separator />
      <EquipmentHeader type="equipmentWithCate" mainCateId={id} />
      <EquipmentList
        type="equipmentWithCate"
        page={eqPage}
        status={status}
        categoryId={id}
        search=""
      />
    </div>
  );
};

export default page;
