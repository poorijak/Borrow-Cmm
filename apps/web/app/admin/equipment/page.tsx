import EquipmentHeader from "@/feature/admin/equipment/components/equipement-header";
import EquipmentList from "@/feature/admin/equipment/components/equipment-list";
import { ActiveStatus } from "@repo/types";
import React from "react";

interface EquipmentPageProps {
  searchParams: Promise<{ eqPage?: string; status?: string }>;
}

const page = async ({ searchParams }: EquipmentPageProps) => {
  const status = (await searchParams).status as ActiveStatus;
  const page = parseInt((await searchParams).eqPage || "1");

  return (
    <div className="space-y-5">
      <EquipmentHeader type="equipmentPage" />
      <EquipmentList type="equipmentPage" status={status} page={page} />
    </div>
  );
};

export default page;
