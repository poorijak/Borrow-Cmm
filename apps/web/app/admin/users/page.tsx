import StudentList from "@/feature/admin/users/components/student-list";
import UserHeader from "@/feature/admin/users/components/user-header";
import { QuerySortType } from "@repo/types";
import React from "react";

interface StudentPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    createdAt?: string;
  }>;
}

const page = async ({ searchParams }: StudentPageProps) => {
  const page = parseInt((await searchParams).page || "1");
  const search = (await (await searchParams).search) || "";
  const createdAt = (await (await searchParams).createdAt) as QuerySortType;
  return (
    <div className="space-y-5">
      <UserHeader type="User-management" />
      <StudentList page={page} search={search} createdAt={createdAt} />
    </div>
  );
};

export default page;
