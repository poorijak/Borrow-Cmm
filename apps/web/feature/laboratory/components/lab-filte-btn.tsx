"use client";

import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Sunrise, Sunset } from "lucide-react";
import React, { useState } from "react";
import { th } from "date-fns/locale";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@iconify/react";

const LabFilterBtn = () => {
  const sp = useSearchParams();
  const bookingDate = sp.get("bookingDate");
  const slotParam = sp.get("slot");
  const router = useRouter();
  const pathName = usePathname();

  const initialDate = bookingDate ? parseISO(bookingDate) : undefined;

  const [date, setDate] = useState<Date | undefined>(initialDate);
  const [slot, setSlot] = useState<string>(slotParam ?? "");

  const handleSlotPicker = (slotValue: string) => {
    const newParams = new URLSearchParams(sp);

    if (slot === slotValue) {
      setSlot("");
      newParams.delete("slot");
    } else {
      setSlot(slotValue);
      newParams.set("slot", slotValue);
    }

    router.push(`${pathName}?${newParams.toString()}`);
  };
  const handlePickDate = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      const newParams = new URLSearchParams(sp);

      newParams.set(
        "bookingDate",
        format(selectedDate, "yyyy-MM-dd"), // ปลอดภัยกว่า toISOString
      );

      router.push(`${pathName}?${newParams.toString()}`);
    }
  };

  const handelClearFilter = () => {
    router.push(pathName);
    setDate(undefined);
    setSlot("");
  };

  return (
    <div className="flex flex-col items-center gap-10 md:flex-row md:justify-between">
      <div className="flex w-full flex-col gap-5 md:flex-row">
        <div className="border-border flex flex-col items-start gap-7 px-0 pb-5 md:border-r md:px-5 md:pb-0">
          <h1 className="text-lg font-bold">
            วันที่ใช้ห้อง <span className="text-destructive">*</span>
          </h1>
          <Popover>
            <PopoverTrigger asChild>
              <div className="relative">
                <Button variant="outline" size="lg">
                  <CalendarIcon />
                  {date ? (
                    <>{format(date, "PPP", { locale: th })}</>
                  ) : (
                    <>เลือกเวลาที่เข้าใช้ห้อง</>
                  )}
                </Button>
                <Badge className="absolute -top-4 -left-1 -rotate-4">
                  วันที่เข้าใช้ห้อง
                </Badge>
              </div>
            </PopoverTrigger>
            <PopoverContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={handlePickDate}
                defaultMonth={date}
                required
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-4">
          <div>
            <h1 className="text-lg font-bold">
              ตั้งแต่เวลา - ถึงเวลา <span className="text-destructive">*</span>
            </h1>
            <p className="text-muted-foreground text-xs">
              ครึ่งเช้า 08:00 น. - 12:00 น. | ครึ่งบ่าย 13:00 น. - 16:30 น.{" "}
            </p>
          </div>
          <div className="flex gap-10">
            <Button
              className="w-32 gap-2"
              variant={slot === "morning" ? "default" : "outline"}
              onClick={() => handleSlotPicker("morning")}
            >
              <Sunrise size={18} />
              ครึ่งเช้า
            </Button>

            <Button
              className="w-32 gap-2"
              variant={slot === "afternoon" ? "default" : "outline"}
              onClick={() => handleSlotPicker("afternoon")}
            >
              <Sunset size={18} />
              ครึ่งบ่าย
            </Button>
          </div>
        </div>
      </div>
      <Button
        variant="link"
        className="border-primary border"
        onClick={handelClearFilter}
      >
        <Icon icon="heroicons:arrow-path-20-solid" />
        รีเซ็ตตัวกรอง
      </Button>
    </div>
  );
};

export default LabFilterBtn;
