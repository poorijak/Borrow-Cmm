import EquipmentSection from "@/feature/home/components/equipmnet-section";
import OrderTable from "@/feature/home/components/order-table";
import SugestionSection from "@/feature/home/components/sugestion-section";
import React from "react";

const page = async () => {
  return (
    <div>
      <EquipmentSection />
      <OrderTable />
      <SugestionSection />
    </div>
  );
};

export default page;
