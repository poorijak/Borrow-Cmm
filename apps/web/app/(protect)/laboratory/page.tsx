import { Separator } from "@/components/ui/separator";
import LabContent from "@/feature/laboratory/components/lab-content";
import LabFilterBtn from "@/feature/laboratory/components/lab-filte-btn";
import LabHeader from "@/feature/laboratory/components/lab-header";
import { getUser } from "@/feature/users/server/user";
import { LaboratorySortType } from "@repo/types";
import React from "react";

interface LaboratoryPageProps {
  searchParams: Promise<{ bookingDate?: string; slot?: string }>;
}

const page = async ({ searchParams }: LaboratoryPageProps) => {
  const user = await getUser();
  const bookingDate = await (await searchParams).bookingDate;
  const slot = (await (await searchParams).slot) as LaboratorySortType;

  return (
    <div>
      <LabHeader />
      <div className="mb-10 space-y-10">
        <LabFilterBtn />
        <Separator />
      </div>
      <LabContent bookingDate={bookingDate} user={user} slot={slot} />
    </div>
  );
};

export default page;
