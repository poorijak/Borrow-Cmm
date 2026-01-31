import LabHeader from "@/feature/admin/laboratory/components/lab-header";
import LaboratoryList from "@/feature/admin/laboratory/components/lab-list";
import type { ActiveStatus } from "@repo/types";
import React from "react";

interface LaboratoryPageProps {
  searchParams: Promise<{
    status?: string;
    page?: string;
    search?: string;
  }>;
}

const page = async ({ searchParams }: LaboratoryPageProps) => {
  const status = (await searchParams).status as ActiveStatus;
  const page = parseInt((await searchParams).page || "1");
  const search = (await (await searchParams).search) || "";

  return (
    <div className="space-y-5">
      <LabHeader />
      <LaboratoryList status={status} page={page} search={search} />
    </div>
  );
};

export default page;
