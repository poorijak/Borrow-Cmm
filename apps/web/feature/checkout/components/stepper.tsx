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
    ...(hasEquipment ? [{ id: "equipment", title: "ยืมอุปกรณ์" }] : []),
    ...(hasLab ? [{ id: "lab", title: "จองห้องปฏิบัติการ" }] : []),
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
    <div className="w-full px-1 pt-5 md:p-15">
      <div className="flex w-full items-start">
        {dynamicSteps.map((item, i) => (
          <React.Fragment key={i}>
            <div
              className="z-10 flex w-20 flex-col items-center gap-2 text-center hover:cursor-pointer md:w-28"
              onClick={() => setActiveState(i)}
            >
              <div
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full text-sm text-white transition-colors duration-300",
                  activeState >= i ? "bg-primary" : "bg-gray-300",
                )}
              >
                {getStepHeader(i)}
              </div>

              <span
                className={cn(
                  "text-xs leading-tight font-medium wrap-break-word transition-colors", // เพิ่ม break-words
                  activeState >= i ? "text-primary" : "text-gray-400",
                )}
              >
                {item.title}
              </span>
            </div>

            {i < dynamicSteps.length - 1 && (
              <div className="relative mt-3 h-0.5 flex-1 bg-gray-200">
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
