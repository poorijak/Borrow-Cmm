import { RefreshCcw } from "lucide-react";
import React from "react";

const Loading = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5">
      <RefreshCcw className="text-primary animate-spin" size={80} />
      <span className="text-muted-foreground">กำลังดึงข้อมูล...</span>
    </div>
  );
};

export default Loading;
