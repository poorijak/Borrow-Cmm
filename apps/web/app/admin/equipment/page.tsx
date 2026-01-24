import EquipmentHeader from "@/feature/admin/equipment/components/equipement-header";
import EquipmentList from "@/feature/admin/equipment/components/equipment-list";
import { ActiveStatus, QuatitySortType } from "@repo/types";
import React from "react";

interface EquipmentPageProps {
  searchParams: Promise<{
    eqPage?: string;
    status?: string;
    mainCategory?: string;
    subCategory?: string;
    totalStock?: string;
  }>;
}

const page = async ({ searchParams }: EquipmentPageProps) => {
  const status = (await searchParams).status as ActiveStatus;
  const page = parseInt((await searchParams).eqPage || "1");
  const mainCate = await (await searchParams).mainCategory;
  const subCate = await (await searchParams).subCategory;
  const totalStock = (await (await searchParams).totalStock) as QuatitySortType;

  return (
    <div className="space-y-5">
      <EquipmentHeader type="equipmentPage" />
      <EquipmentList
        type="equipmentPage"
        categoryId={mainCate}
        subCategoryId={subCate}
        status={status}
        page={page}
        totalStock={totalStock}
      />
    </div>
  );
};

export default page;
