import Modal from "@/components/shared/modal";
import { Button } from "@/components/ui/button";
import { TriangleAlert } from "lucide-react";
import React, { useEffect } from "react";
import SubmitBtn from "@/components/shared/submit-btn";
import { useDeleteEquipment } from "../hooks/useEquipment";
import { Equipment } from "@repo/types";

type DeleteEquipmentProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: Equipment | undefined;
};

const DeleteEquipmentModal = ({
  open,
  onOpenChange,
  data,
}: DeleteEquipmentProps) => {
  const { mutate, isPending, isSuccess } = useDeleteEquipment();

  const handleDeleteEquipment = () => {
    mutate(data?.id);
  };

  useEffect(() => {
    if (isSuccess) {
      onOpenChange(false);
    }
  }, [isSuccess, onOpenChange]);

  return (
    <Modal onOpenChange={onOpenChange} open={open} size="sm">
      <div className="flex flex-col items-center justify-center">
        <div className="bg-destructive/10 mb-7 flex size-25 items-center justify-center rounded-full p-1">
          <TriangleAlert className="text-destructive" size={60} />
        </div>
        <div className="mb-4 flex flex-col items-center gap-2">
          <span className="text-xl font-bold">
            คุณต้องการลบหมวดหมู่{" "}
            <span className="text-destructive">{data?.title}</span> ใช่หรือไม่?
          </span>
          <p className="text-muted-foreground text-center text-xs">
            การลบจะไม่ส่งผลต่ออุปกรณ์ที่มีอยู่
            แต่หมวดหมู่นี้จะไม่สามารถใช้งานได้อีกต่อไป
          </p>
        </div>

        <div className="mt-5 flex w-full flex-col items-center gap-3">
          <SubmitBtn
            variant="destructive"
            size="lg"
            onClick={handleDeleteEquipment}
            className="w-full"
            title="ใช่ ลบเลย"
            pending={isPending}
          />
          <Button
            variant="outline"
            size="lg"
            onClick={() => onOpenChange(false)}
            className="w-full"
          >
            ไม่ เก็บไว้ก่อน
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteEquipmentModal;
