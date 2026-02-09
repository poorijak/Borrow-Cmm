"use client";

import React from "react";
import { useGetMyBag } from "../hooks/useMyBag";
import { Card } from "@/components/ui/card";
import BagItemCard from "./bag-item-card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BagItemsProps {
  userId?: string;
}

const BagItems = ({ userId }: BagItemsProps) => {
  const { data } = useGetMyBag(userId);

  console.log(data);

  const equipmentItems = data?.equipmentItems ?? [];
  const labItems = data?.labItems ?? [];
  const isEmpty = equipmentItems.length === 0 && labItems.length === 0;

  return (
    <>
      {isEmpty ? (
        <div className="md:-mt-24 mt-24 flex h-full w-full items-center justify-center overflow-hidden">
          <div className="flex size-40 flex-col items-center justify-center gap-2 rounded-full bg-slate-100 p-5">
            <ShoppingBag className="text-muted-foreground" size={50} />
            <p className="text-muted-foreground text-sm font-bold">
              ไม่มีของในกระเป๋า!
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {equipmentItems && equipmentItems.length >= 1 && (
            <Card className="rounded-md p-5 shadow-none">
              <div className="space-y-3">
                <h2 className="text-primary text-lg font-bold">
                  อุปกรณ์{" "}
                  <span className="text-muted-foreground text-base font-medium">
                    {data?.equipmentCount}
                  </span>
                </h2>
                <ScrollArea
                  className={cn(
                    equipmentItems && equipmentItems.length >= 1 && "h-56",
                    equipmentItems.length >= 1 && labItems.length === 0 && "h-full",
                  )}
                >
                  {equipmentItems.map((item, index) => (
                    <div key={item.id} className="mb-5 space-y-5">
                      <BagItemCard equipmentItem={item} userId={userId} />
                      {index !== equipmentItems.length - 1 && <Separator />}
                    </div>
                  ))}
                </ScrollArea>
              </div>
            </Card>
          )}
          {labItems && labItems.length >= 1 && (
            <Card className="rounded-md p-4 shadow-none">
              <div className="space-y-3">
                <h2 className="text-primary text-lg font-bold">
                  ห้องปฏิบัติการ{" "}
                  <span className="text-muted-foreground text-base font-medium">
                    {labItems.length}
                  </span>
                </h2>
                <ScrollArea className="h-56">
                  {labItems.map((item) => (
                    <div key={item.id} className="mb-5 space-y-5">
                      <BagItemCard labItem={item} />
                      <Separator />
                    </div>
                  ))}
                </ScrollArea>
              </div>
            </Card>
          )}
          <Button className="w-full">ถัดไป</Button>
        </div>
      )}
    </>
  );
};

export default BagItems;
