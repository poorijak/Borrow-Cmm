import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { ActiveStatus } from "@repo/types";
import { Check, ChevronDown, CircleCheck, CircleX } from "lucide-react";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";

interface StatsuDropdownProps {
  currentStatus: ActiveStatus;
  onStatusChange: (newStatus: ActiveStatus) => void;
}

const StatsuDropdown = ({
  currentStatus,
  onStatusChange,
}: StatsuDropdownProps) => {
  const statusOptions: ActiveStatus[] = ["active", "inactive"];

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "px-1  py-1 text-sm rounded-full cursor-pointer",
              currentStatus === "active"
                ? "bg-[#DCFAE9] text-green-600  hover:bg-[#c2f6d9] hover:text-green-600"
                : "bg-[#FFE9E5]"
            )}
          >
            {currentStatus === "active" ? (
              <>
               
                <span>เปิดใช้งาน</span>
              </>
            ) : (
              <>
                <CircleX />
                <span>ปิดใช้งาน</span>
              </>
            )}
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          {statusOptions.map((opt, i) => (
            <DropdownMenuItem key={i} onClick={() => onStatusChange(opt)}>
              {opt === "active" ? (
                <>
                  <CircleCheck className="text-green-600" />
                  <span>เปิดใช้งาน</span>
                </>
              ) : (
                <>
                  <CircleX className="text-destructive" />
                  <span>ปิดใช้งาน</span>
                </>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default StatsuDropdown;
