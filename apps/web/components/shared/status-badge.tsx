import { Badge } from "@/components/ui/badge";
import { getStatusConfig } from "@/lib/format/getStatusConfig";
import { ChevronDown } from "lucide-react"; // สำหรับลูกศรด้านหลังตามรูป

export const StatusBadge = ({ status }: { status: string }) => {
  const config = getStatusConfig(status);

  return (
    <Badge
      variant="outline"
      className={`flex w-fit items-center gap-2 rounded-full border px-4 py-1 font-medium transition-all ${config.color} `}
    >
      {config.icon}
      <span>{config.label}</span>
    </Badge>
  );
};
