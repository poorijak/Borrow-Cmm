import EquipmentWrapper from "@/feature/equipment/components/equipment-wrapper";
import { getUser } from "@/feature/users/server/user";
import React from "react";

interface equipmentPageProps {
  params: { id: string };
}

const page = async ({ params }: equipmentPageProps) => {
  const { id } = await params;
  const user = await getUser();

  return <EquipmentWrapper id={id} user={user} />;
};

export default page;
