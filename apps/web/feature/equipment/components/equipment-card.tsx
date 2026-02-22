import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAddToBag } from "@/feature/bag/hooks/useMyBag";
import { getPublicUrl } from "@/lib/utils";
import { ActiveStatus } from "@repo/types";
import Image from "next/image";
import React from "react";

interface EquipmentCardProps {
  title: string;
  userId: string;
  id: string;
  description: string | null;
  image: string;
  totalStock: number;
  availableQty: number;
  status: ActiveStatus;
}

const EquipmentCard = ({
  userId,
  title,
  id,
  description,
  image,
  totalStock,
  availableQty,
  status,
}: EquipmentCardProps) => {
  const { mutate, isPending } = useAddToBag();

  const handleAddToBag = () => {
    mutate({
      userId,
      equipmentId: id,
    });
  };

  const disable = status === "inactive" || totalStock <= 0 || isPending;

  return (
    <div>
      <Card className="relative rounded-lg">
        <Badge className="absolute top-3 right-3 rounded-sm px-3 py-1">
          <label className="flex items-center gap-2 text-xs text-white">
            <span className="hidden text-white/85 md:flex">จำนวนคงเหลือ</span>{" "}
            {availableQty}/{totalStock}
          </label>
        </Badge>
        <CardContent className="flex flex-col gap-3 px-3 md:px-6">
          <div className="bg-primary/5 mb-1 flex w-full items-center justify-center rounded-md p-5 md:mb-3">
            <div className="relative aspect-square size-28 md:size-40">
              <Image
                src={getPublicUrl(image)}
                fill
                alt="Preview Equipment"
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw"
              />
            </div>
          </div>
          <h1 className="text-base font-bold md:text-xl">{title}</h1>
          <p className="text-muted-foreground flex text-[10px] md:text-xs">
            {description}
          </p>

          <Separator />
        </CardContent>

        <CardFooter>
          <Button
            className="w-full rounded-sm"
            disabled={disable}
            onClick={handleAddToBag}
          >
            {status === "inactive" || totalStock <= 0
              ? "ไม่พร้อมใช้งาน"
              : "ใส่กระเป๋า"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EquipmentCard;
