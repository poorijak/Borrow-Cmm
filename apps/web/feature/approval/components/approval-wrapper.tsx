"use client";

import React from "react";
import ApprovalHeader from "./approval-header";
import ApprovalContent from "./approval-content";
import { useGetRequest } from "../hooks/useApproval";

interface ApprovalWrapperProps {
  token: string;
}

const ApprovalWrapper = ({ token }: ApprovalWrapperProps) => {
  const { data } = useGetRequest(token);

  return (
    <div>
      {data ? (
        <div className="flex flex-col gap-4 md:px-24">
          <ApprovalHeader fullName={data.request.fullName} />
          <ApprovalContent token={token} request={data} />
        </div>
      ) : (
        <>ไม่มีข้อมูล</>
      )}
    </div>
  );
};

export default ApprovalWrapper;
