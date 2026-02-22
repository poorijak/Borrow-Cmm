import { RefreshCcw } from "lucide-react";
import React from "react";

const Loading = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5">
      <RefreshCcw className="text-primary size-16 animate-spin" />
      <span className="text-muted-foreground">กำลังดึงข้อมูล...</span>
    </div>
  );
};

export default Loading;
