import CourseHeader from "@/feature/admin/course/components/course-header";
import CourseList from "@/feature/admin/course/components/course-list";
import { ActiveStatus } from "@repo/types";
import React from "react";

interface CoursePageProps {
  searchParams: Promise<{
    page?: string;
    status?: string;
    search?: string;
  }>;
}

const page = async ({ searchParams }: CoursePageProps) => {
  const status = (await searchParams).status as ActiveStatus;
  const page = parseInt((await (await searchParams).page) || "1");
  const search = (await (await searchParams).search) || "";

  return (
    <div className="space-y-5">
      <CourseHeader />
      <CourseList status={status} page={page} search={search} />
    </div>
  );
};

export default page;
