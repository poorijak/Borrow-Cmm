import React from "react";
import RequestHeader from "@/feature/admin/requests/components/list/request-header";
import RequestList from "@/feature/admin/requests/components/list/request-list";
import { RequestQueryType } from "@repo/types";

interface RequestPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    type?: string;
    status?: string;
    subjectId?: string;
    teacherId?: string;
  }>;
}

const page = async ({ searchParams }: RequestPageProps) => {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const search = params.search || "";
  const type = params.type as RequestQueryType;
  const status = params.status;
  const subjectId = params.subjectId?.split(",");
  const teacherId = params.teacherId?.split(",");

  return (
    <div className="space-y-5">
      <RequestHeader />
      <RequestList
        page={page}
        search={search}
        type={type}
        status={status}
        subjectId={subjectId}
        teacherId={teacherId}
      />
    </div>
  );
};

export default page;
