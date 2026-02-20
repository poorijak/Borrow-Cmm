import { ClipboardList } from "lucide-react";
import React from "react";

interface ApprovalHeaderProps {
  fullName?: string;
}

const ApprovalHeader = ({ fullName }: ApprovalHeaderProps) => {
  console.log("fullName", fullName);

  return (
    <div className="mt-4 flex w-full flex-col items-center justify-center gap-4">
      <div className="bg-primary flex size-15 items-center justify-center rounded-full p-2 text-white">
        <ClipboardList size={30} />
      </div>
      <h1 className="text-2xl font-bold">อนุมัติคำขอ</h1>
    </div>
  );
};

export default ApprovalHeader;
