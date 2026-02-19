import { Clipboard, ClipboardList } from "lucide-react";
import React from "react";

const ApprovalHeader = () => {
  return (
    <div className="flex w-full gap-3 flex-col items-center justify-center">
      <div className="bg-primary flex size-20 items-center justify-center rounded-full p-2 text-white">
        <ClipboardList size={40}/>
      </div>
      <h1 className="text-2xl font-bold text-muted-foreground">อนุมัติคำขอของ</h1>
    </div>
  );
};

export default ApprovalHeader;
