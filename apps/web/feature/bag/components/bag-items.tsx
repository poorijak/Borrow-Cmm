"use client";

import React from "react";
import { useGetMyBag } from "../hooks/useMyBag";
import { Card } from "@/components/ui/card";
import BagItemCard from "./bag-item-card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BagItemsProps {
  userId?: string;
}

const BagItems = ({ userId }: BagItemsProps) => {
  const { data } = useGetMyBag(userId);

  console.log(data);

  const equipmentItems = data?.equipmentItems ?? [];
  const labItems = data?.labItems ?? [];

  return (
    <div className="flex flex-col gap-3">
      <Card className="rounded-md p-5 shadow-none">
        <div className="space-y-3">
          <h2 className="text-primary text-lg font-bold">อุปกรณ์</h2>
          {equipmentItems ? (
            <ScrollArea className="h-72">
              {equipmentItems.map((item) => (
                <div key={item.id} className="mb-5 space-y-5">
                  <BagItemCard equipmentItem={item} userId={userId} />
                  <Separator />
                </div>
              ))}
            </ScrollArea>
          ) : (
            <>ไม่มีของในตะกร้า</>
          )}
        </div>
      </Card>
      <Card className="rounded-md p-4 shadow-none">
        <div className="space-y-3">
          <h2 className="text-primary text-lg font-bold">ห้องปฏิบัติการ</h2>
          {labItems ? (
            <ScrollArea className="h-72">
              {labItems.map((item) => (
                <div key={item.id} className="mb-5 space-y-5">
                  <BagItemCard labItem={item} />
                  <Separator />
                </div>
              ))}
            </ScrollArea>
          ) : (
            <>ไม่มีของในตะกร้า</>
          )}
        </div>
      </Card>
    </div>
  );
};

export default BagItems;
