import ApprovalContent from "@/feature/approval/components/approval-content";
import ApprovalHeader from "@/feature/approval/components/approval-header";
import ApprovalWrapper from "@/feature/approval/components/approval-wrapper";
import React from "react";

interface ApprovalPageProps {
  params: { token: string };
}

const page = async ({ params }: ApprovalPageProps) => {
  const { token } = await params;

  console.log("token ", token);

  return (
    <div className="w-full">
      <ApprovalWrapper token={token} />
    </div>
  );
};

export default page;
