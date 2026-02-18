import { Button } from "@/components/ui/button";
import { cn, getPublicUrl } from "@/lib/utils";
import { BagEquipmentItem, BagLabItem } from "@repo/types";
import { Calendar, Minus, Plus, Sunrise, Sunset, Trash2 } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import React from "react";
import { th } from "date-fns/locale";
import {
  useDeleteBagItem,
  useSelectItem,
  useUpdateItemCount,
} from "../hooks/useMyBag";
import { Checkbox } from "@/components/ui/checkbox";

interface BagItemCardProps {
  equipmentItem?: BagEquipmentItem;
  labItem?: BagLabItem;
  userId?: string;
}

const BagItemCard = ({ equipmentItem, labItem, userId }: BagItemCardProps) => {
  const equipment = equipmentItem?.equipment;
  const lab = labItem?.laboratory;

  const { mutate } = useUpdateItemCount();
  const { mutate: deleteBagItem, isPending } = useDeleteBagItem();
  const { mutate: selectedItem } = useSelectItem();

  const handleIncrementCount = () => {
    mutate({
      itemId: equipmentItem?.id,
      action: "inc",
      userId,
    });
  };
  const handleDecrementCount = () => {
    mutate({
      itemId: equipmentItem?.id,
      action: "dec",
      userId,
    });
  };

  const itemType: "lab" | "equipment" = equipmentItem ? "equipment" : "lab";

  const hanleSelectedItem = (type: "lab" | "equipment") => {
    const itemId = type === "equipment" ? equipmentItem?.id : labItem?.id;

    if (!itemId) return;

    selectedItem({
      itemId,
      type,
      userId,
    });
  };

  const handleDeleteBagItem = () => {
    if (equipment) {
      deleteBagItem({
        userId,
        type: "equipment",
        itemId: equipmentItem?.id,
      });
    }
    if (lab) {
      deleteBagItem({
        userId,
        type: "lab",
        itemId: labItem?.id,
      });
    }
  };

  return (
    <div className="flex flex-col justify-between gap-3 pr-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          <Checkbox
            className="size-5"
            checked={
              equipmentItem ? equipmentItem?.isSelected : labItem?.isSelected
            }
            onCheckedChange={() => hanleSelectedItem(itemType)}
          />
          <div className="relative aspect-square size-12 rounded-sm bg-slate-100 md:size-16">
            <Image
              src={getPublicUrl(equipment?.mainImage || lab?.image)}
              alt="Item preview"
              fill
              className="rounded-sm object-cover"
            />
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs">{lab?.labCode}</p>
            <p className="text-sm font-bold md:text-base">
              {equipment?.title || lab?.name}
            </p>
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
                      "text-xs md:text-sm",
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
          {equipment && (
            <>
              <Button
                onClick={handleDecrementCount}
                variant="outline"
                size="icon-xs"
                disabled={isPending}
              >
                <Minus />
              </Button>
              <div className="text-sm">{equipmentItem?.itemCount}</div>
              <Button
                onClick={handleIncrementCount}
                variant="outline"
                size="icon-xs"
                disabled={
                  isPending || equipmentItem.itemCount >= equipment.totalStock
                }
              >
                <Plus />
              </Button>
            </>
          )}
          <Button
            variant="outline"
            size="icon-xs"
            className="border-destructive text-destructive"
            onClick={handleDeleteBagItem}
          >
            <Trash2 />
          </Button>
        </div>
      </div>

      {labItem && (
        <div className="ml-10 flex flex-col gap-2 text-sm">
          <h3 className="font-bold">รายละเอียด</h3>
          <div className="flex items-center gap-3">
            <p className="flex items-center gap-2">
              <Calendar size={15} className="text-muted-foreground" />
              {format(labItem!.date, "PPP", { locale: th })}
            </p>
            <div>
              {labItem?.slot === "afternoon" ? (
                <div className="flex items-center gap-2">
                  <Sunset size={15} className="text-muted-foreground" />
                  <span>ช่วงบ่าย</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sunrise size={15} className="text-muted-foreground" />
                  <span>ช่วงเช้า</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BagItemCard;
