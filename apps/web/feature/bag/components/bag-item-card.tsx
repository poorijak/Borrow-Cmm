import { Button } from "@/components/ui/button";
import { cn, getPublicUrl } from "@/lib/utils";
import { BagEquipmentItem, BagLabItem } from "@repo/types";
import { Calendar, Minus, Plus, Sunrise, Sunset, Trash2 } from "lucide-react";
import Image from "next/image";
import { format, parseISO } from "date-fns";
import React from "react";
import { th } from "date-fns/locale";
import { useUpdateItemCount } from "../hooks/useMyBag";

interface BagItemCardProps {
  equipmentItem?: BagEquipmentItem;
  labItem?: BagLabItem;
}

const BagItemCard = ({ equipmentItem, labItem }: BagItemCardProps) => {
  const equipment = equipmentItem?.equipment;
  const lab = labItem?.laboratory;

  const { mutate, isPending } = useUpdateItemCount();

  const handleIncrementCount = () => {
    mutate({
      itemId: equipmentItem?.id,
      action: "inc",
    });
  };
  const handleDecrementCount = () => {
    mutate({
      itemId: equipmentItem?.id,
      action: "dec",
    });
  };

  return (
    <div className="flex justify-between pr-4">
      <div className="flex gap-3">
        <div className="relative aspect-square size-16 rounded-sm bg-slate-100">
          <Image
            src={getPublicUrl(equipment?.mainImage || lab?.image)}
            alt="Item preview"
            fill
            className="rounded-md object-cover"
          />
        </div>
        <div className="">
          <p className="text-muted-foreground text-sm">{lab?.labCode}</p>
          <p className="font-bold">{equipment?.title || lab?.name}</p>
          {equipment ? (
            <p className="text-sm">
              คงเหลือ{" "}
              <span className="text-primary">{equipment?.totalStock}</span>
            </p>
          ) : (
            <>
              <p className="text-sm">
                <span
                  className={cn(
                    lab?.status ? "text-destructive" : "text-primary",
                  )}
                >
                  {lab?.status ? "ห้องนี้ไม่ว่างแล้ว" : "ห้องยังว่างอยู่"}
                </span>
              </p>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        {equipment ? (
          <>
            <Button
              onClick={handleDecrementCount}
              variant="outline"
              size="icon-xs"
            >
              <Minus />
            </Button>
            <div>{equipmentItem?.itemCount}</div>
            <Button
              onClick={handleIncrementCount}
              variant="outline"
              size="icon-xs"
            >
              <Plus />
            </Button>
          </>
        ) : (
          <div className="flex flex-col gap-2 text-xs">
            <p className="flex items-center gap-2">
              <Calendar size={15} className="text-muted-foreground" />
              {format(labItem!.date, "PPP", { locale: th })}
            </p>
            <div>
              {labItem?.slot === "afternoon" ? (
                <div className="flex items-center gap-2">
                  <Sunset size={15} />
                  <span>ช่วงบ่าย</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sunrise size={15} />
                  <span>ช่วงเช้า</span>
                </div>
              )}
            </div>
          </div>
        )}
        <Button
          variant="outline"
          size="icon-xs"
          className="border-destructive text-destructive"
        >
          <Trash2 />
        </Button>
      </div>
    </div>
  );
};

export default BagItemCard;
