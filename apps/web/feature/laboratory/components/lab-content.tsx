"use client";

import { LaboratorySortType } from "@repo/types";
import React from "react";
import { useGetLaboratory } from "../hooks/useLaboratory";
import Image from "next/image";
import { getPublicUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Loading from "@/components/shared/loading";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface LabContentProps {
  bookingDate?: string;
  slot?: LaboratorySortType;
}

const LabContent = ({ bookingDate, slot }: LabContentProps) => {
  const { data } = useGetLaboratory(bookingDate, slot);

  const isFilterSelected = !!bookingDate && !!slot;

  console.log(data);

  return (
    <div>
      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        {data && data.length > 0 ? (
          data?.map((lab) => {
            const isInactive = lab.status === "inactive";
            const isNotAvailable = lab.isAvailable === false;

            const getButtonText = () => {
              if (isInactive) return "ปิดปรับปรุง";
              if (!isFilterSelected) return "กรุณาเลือกวัน/เวลา";
              if (isNotAvailable) return "ไม่ว่าง/ถูกจองแล้ว";
              return "จองเลย!";
            };

            const isDisabled =
              isInactive || isNotAvailable || !isFilterSelected;

            return (
              <div
                key={lab.id}
                className="border-border col-span-1 space-y-5 rounded-md border"
              >
                <div className="relative h-52 min-w-full md:h-[400px]">
                  <Image
                    src={getPublicUrl(lab.image)}
                    fill
                    alt="lab preview"
                    className="rounded-tl-md rounded-tr-md object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-col gap-3 px-3 pb-5">
                  <div>
                    <h3 className="text-lg font-bold">{lab.labCode}</h3>
                    <label className="text-muted-foreground line-clamp-1 text-sm">
                      {lab.name}
                    </label>
                  </div>
                  <Button
                    className="rounded-sm"
                    disabled={isDisabled}
                  >
                    {getButtonText()}
                  </Button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-4 h-[400px] w-full">
            {/* <Loading /> */}
            <div className="grid grid-cols-4 gap-5">
              {Array.from({ length: 4 }).map((_, index) => (
                <Card key={index} className="w-full max-w-xs shadow-none">
                  <CardHeader>
                    <Skeleton className="aspect-video w-full" />
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3">
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LabContent;
