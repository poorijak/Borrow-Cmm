"use client";

import React from "react";
import EquipmentHeader from "./equipment-header";
import EquipmentContent from "./equipment-content";
import { useGetEquipmentByCategoryId } from "../hooks/useEquipment";
import { User } from "@repo/types";

interface EquipmentWrapperProps {
  id: string;
  user: User | null;
}

const EquipmentWrapper = ({ id, user }: EquipmentWrapperProps) => {
  const { data } = useGetEquipmentByCategoryId(id);

  return (
    <div>
      <EquipmentHeader title={data?.category?.title} />
      <EquipmentContent data={data} userId={user!.id} />
    </div>
  );
};

export default EquipmentWrapper;
