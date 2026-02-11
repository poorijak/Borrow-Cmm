"use client";

import React from "react";
import { useGetMyBag, useSelectAllItem } from "../hooks/useMyBag";
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

  const equipmentItems = data?.equipmentItems ?? [];
  const labItems = data?.labItems ?? [];
  const isEmpty = equipmentItems.length === 0 && labItems.length === 0;
  const { mutate: selectedAll } = useSelectAllItem();

  const handleSelectItemAll = (type: "lab" | "equipment") => {
    selectedAll({
      bagId: data?.id,
      type,
      userId,
    });
  };

  const isAllSelected = (type: "lab" | "equipment") => {
    if (type === "equipment") {
      return equipmentItems.every((item) => item.isSelected);
    } else {
      return labItems.every((item) => item.isSelected);
    }
  };

  const hasEquipment = equipmentItems.length > 0;
  const hasLab = labItems.length > 0;
  const hasBoth = hasEquipment && hasLab;

  const getSelectedCount = (type: "lab" | "equipment") => {
    const items = type === "equipment" ? equipmentItems : labItems;
    const selected = items.filter((i) => i.isSelected).length;
    return `${selected}/${items.length}`;
  };

  return (
    <>
      {isEmpty ? (
        <div className="mt-24 flex h-full w-full items-center justify-center overflow-hidden md:-mt-24">
          <div className="flex size-40 flex-col items-center justify-center gap-2 rounded-full bg-slate-100 p-5">
            <ShoppingBag className="text-muted-foreground" size={50} />
            <p className="text-muted-foreground text-sm font-medium">
              ไม่มีของในกระเป๋า!
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {equipmentItems && equipmentItems.length >= 1 && (
            <Card className="rounded-md p-5 shadow-none">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-primary text-lg font-bold">อุปกรณ์ </h2>
                  <Button
                    className={cn(
                      isAllSelected("equipment")
                        ? "text-primary"
                        : "text-black",
                    )}
                    variant="link"
                    size="sm"
                    onClick={() => handleSelectItemAll("equipment")}
                  >
                    เลือกทั้งหมด {getSelectedCount("equipment")}
                  </Button>
                </div>
                <ScrollArea className={cn(hasBoth ? "h-52" : "h-[500px]")}>
                  {equipmentItems.map((item) => (
                    <div key={item.id} className="mb-5 space-y-5">
                      <BagItemCard equipmentItem={item} userId={userId} />
                      <Separator />
                    </div>
                  ))}
                </ScrollArea>
              </div>
            </Card>
          )}
          {labItems && labItems.length >= 1 && (
            <Card className="rounded-md p-4 shadow-none">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-primary text-lg font-bold">
                    ห้องปฏิบัติการ{" "}
                  </h2>
                  <Button
                    className={cn(
                      isAllSelected("lab") ? "text-primary" : "text-black",
                    )}
                    variant="link"
                    size="sm"
                    onClick={() => handleSelectItemAll("lab")}
                  >
                    เลือกทั้งหมด {getSelectedCount("lab")}
                  </Button>
                </div>
                <ScrollArea className={cn(hasBoth ? "h-52" : "h-[500px]")}>
                  {labItems.map((item) => (
                    <div key={item.id} className="mb-5 space-y-5">
                      <BagItemCard labItem={item} userId={userId} />
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
