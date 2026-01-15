import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Badge } from "../ui/badge";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type styleButtonType = {
  bgColor?: string;
  textColor?: string;
};

type Option<T extends string> = {
  value: T;
  lable: string;
  icon?: React.ReactNode;
  style?: styleButtonType;
  clasName?: string;
};

interface DropdownStatusProps<T extends string> {
  value: T;
  onStatusChange: (v: T) => void;
  option: Option<T>[];
}

export default function DropdownStatus<T extends string>({
  value,
  onStatusChange,
  option,
}: DropdownStatusProps<T>) {
  const currentStatus = option.find((o) => o.value === value);

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Badge
            style={{ backgroundColor: currentStatus?.style?.bgColor }}
            className={cn(
              "py-1 md:py-1.5 hover:cursor-pointer rounded-md",
              currentStatus?.clasName
            )}
          >
            {currentStatus?.icon}
            <span style={{ color: currentStatus?.style?.textColor }}>
              {currentStatus?.lable}
            </span>
            <ChevronDown style={{ color: currentStatus?.style?.textColor }} />
          </Badge>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          {option.map((opt, i) => (
            <DropdownMenuItem
              key={i}
              onClick={() => onStatusChange(opt.value)}
              disabled={currentStatus?.value === opt.value}
            >
              {opt.icon}
              <span>{opt.lable}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
