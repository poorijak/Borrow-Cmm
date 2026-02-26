import EquipmentSection from "@/feature/home/components/equipmnet-section";
import OrderTable from "@/feature/home/components/order-table";
import SugestionSection from "@/feature/home/components/sugestion-section";
import React from "react";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    status?: string;
  }>;
}

const page = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const status = params.status || "all";

  return (
    <div>
      <EquipmentSection />
      <OrderTable page={page} status={status} />
      <SugestionSection />
    </div>
  );
};

export default page;
