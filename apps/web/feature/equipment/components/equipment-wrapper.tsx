"use client";

import React from "react";
import EquipmentHeader from "./equipment-header";
import EquipmentContent from "./equipment-content";
import { useGetEquipmentByCategoryId } from "../hooks/useEquipment";

interface EquipmentWrapperProps {
  id: string;
}

const EquipmentWrapper = ({ id }: EquipmentWrapperProps) => {
  const { data } = useGetEquipmentByCategoryId(id);

  return (
    <div>
      <EquipmentHeader title={data?.category?.title} />
      <EquipmentContent data={data} />
    </div>
  );
};

export default EquipmentWrapper;
