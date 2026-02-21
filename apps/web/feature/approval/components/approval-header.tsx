import { ClipboardList } from "lucide-react";
import React from "react";

interface ApprovalHeaderProps {
  fullName?: string;
}

const ApprovalHeader = ({ fullName }: ApprovalHeaderProps) => {
  console.log("fullName", fullName);

  return (
    <div className="-mx-5 -mt-5 mb-10 flex h-44 w-[calc(100%+2.5rem)]  flex-col items-center justify-center gap-4 bg-[url('/images/auth/auth-bg-2.webp')] bg-cover p-5">
      <div className="flex size-20 items-center justify-center rounded-full border-2 border-white p-2 text-white bg-white">
        <ClipboardList className="text-primary" size={40} />
      </div>
      <h1 className="text-2xl font-bold text-white">อนุมัติคำขอ</h1>
    </div>
  );
};

export default ApprovalHeader;
