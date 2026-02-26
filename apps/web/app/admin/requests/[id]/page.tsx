import RequestWrapper from "@/feature/admin/requests/components/request-wrapper";
import React from "react";

interface RequsetProps {
  params: { id: string };
}

const page = async ({ params }: RequsetProps) => {
  const { id } = await params;

  return (
    <div>
      <RequestWrapper id={id} />
    </div>
  );
};

export default page;
