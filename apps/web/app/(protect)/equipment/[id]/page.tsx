import EquipmentWrapper from "@/feature/equipment/components/equipment-wrapper";
import React from "react";

interface equipmentPageProps {
  params: { id: string };
}

const page = async ({ params }: equipmentPageProps) => {
  const { id } = await params;

  return <EquipmentWrapper id={id} />;
};

export default page;
