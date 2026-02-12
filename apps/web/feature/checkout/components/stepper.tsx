import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Check, Loader, LoaderCircle } from "lucide-react";
import React from "react";

interface StepperProps {
  activeState: number;
  setActiveState: (state: number) => void;
  hasEquipment?: boolean;
  hasLab?: boolean;
}

const Stepper = ({
  activeState,
  setActiveState,
  hasEquipment,
  hasLab,
}: StepperProps) => {
    
  const dynamicSteps = [
    { id: "user", title: "ข้อมูลผู้ยืม" },
    ...(hasEquipment ? [{ id: "equipment", title: "การยืมอุปกรณ์" }] : []),
    ...(hasLab ? [{ id: "lab", title: "การจองห้องปฏิบัติการ" }] : []),
    { id: "summary", title: "ส่งคำขอ" },
  ];

  const getStepHeader = (index: number) => {
    if (activeState === index) {
      return <LoaderCircle size={14} className="animate-spin" />;
    }

    if (index < activeState) {
      return <Check size={14} />;
    }

    return <span>{index + 1}</span>;
  };
  return (
    <div className="w-full p-5 md:p-15">
      <div className="flex w-full items-center">
        {dynamicSteps.map((item, i) => (
          <React.Fragment key={i}>
            <div
              className="relative z-10 flex flex-col items-center hover:cursor-pointer"
              onClick={() => setActiveState(i)}
            >
              <div
                className={cn(
                  "flex size-6 items-center justify-center rounded-full text-sm text-white transition-colors duration-300",
                  activeState >= i ? "bg-primary" : "bg-[#1c1c1c]",
                )}
              >
                {getStepHeader(i)}
              </div>
              <span
                className={cn(
                  "absolute -bottom-7 w-max text-xs font-medium transition-colors",
                  activeState >= i ? "text-primary" : "text-gray-400",
                )}
              >
                {item.title}
              </span>
            </div>

            {i < dynamicSteps.length - 1 && (
              <div className="relative mx-4 h-[2px] flex-1 bg-gray-200">
                <div
                  className={cn(
                    "bg-primary absolute top-0 left-0 h-full transition-all duration-500",
                    activeState > i ? "w-full" : "w-0",
                  )}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Stepper;
