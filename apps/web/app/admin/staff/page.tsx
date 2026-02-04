import StaffList from "@/feature/admin/users/components/staff-list";
import UserHeader from "@/feature/admin/users/components/user-header";
import { QuerySortType } from "@repo/types";
import React from "react";

interface StaffPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    createdAt?: string;
    updatedAt?: string;
    role?: string;
  }>;
}

const page = async ({ searchParams }: StaffPageProps) => {
  const page = parseInt((await searchParams).page || "1");
  const search = (await (await searchParams).search) || "";
  const createdAt = (await (await searchParams).createdAt) as QuerySortType;
  const updatedAt = (await (await searchParams).updatedAt) as QuerySortType;
  const roleParam = (await (await searchParams).role) || "";
  const role = roleParam.trim() ? roleParam : undefined;

  return (
    <div className="space-y-5">
      <UserHeader type="Staff-management" />
      <StaffList
        page={page}
        search={search}
        createdAt={createdAt}
        updatedAt={updatedAt}
        role={role}
      />
    </div>
  );
};

export default page;
