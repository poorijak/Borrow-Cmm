import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Badge } from "../ui/badge";
import { ChevronDown } from "lucide-react";

type Option<T extends string> = {
  value: T;
  lable: string;
  icon?: React.ReactNode;
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
          <Badge className="py-1 hover:cursor-pointer" variant="outline">
            {currentStatus?.icon}
            <span> {currentStatus?.lable}</span>
            <ChevronDown />
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
