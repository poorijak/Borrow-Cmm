import Modal from "@/components/shared/modal";
import { Button } from "@/components/ui/button";
import { TriangleAlert } from "lucide-react";
import React, { useEffect } from "react";
import { useDeleteCategory } from "../hooks/useCategory";
import SubmitBtn from "@/components/shared/submit-btn";
import { useDeleteSubCategory } from "../../subCategory/hooks/useSubCate";

type DeleleCategoryModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: {
    id: string;
    title: string;
  };
};

const DeleleCategoryModal = ({
  open,
  onOpenChange,
  data,
}: DeleleCategoryModalProps) => {
  const { mutate, isPending, isSuccess } = useDeleteSubCategory();

  const handleDeleteCategory = () => {
    mutate(data.id);
  };

  useEffect(() => {
    if (isSuccess) {
      onOpenChange(false);
    }
  }, [isSuccess, onOpenChange]);

  return (
    <Modal onOpenChange={onOpenChange} open={open} size="sm">
      <div className="flex justify-center  flex-col  items-center">
        <div className="size-25 mb-7 flex justify-center  items-center  p-1 rounded-full bg-destructive/10">
          <TriangleAlert className="text-destructive" size={60} />
        </div>
        <div className="flex items-center flex-col gap-2 mb-4">
          <span className="text-xl font-bold">
            คุณต้องการลบหมวดหมู่{" "}
            <span className="text-destructive">{data?.title}</span> ใช่หรือไม่?
          </span>
          <p className="text-xs text-center text-muted-foreground">
            การลบจะไม่ส่งผลต่ออุปกรณ์ที่มีอยู่
            แต่หมวดหมู่นี้จะไม่สามารถใช้งานได้อีกต่อไป
          </p>
        </div>

        <div className="flex w-full items-center flex-col mt-5 gap-3">
          <SubmitBtn
            variant="destructive"
            size="lg"
            onClick={handleDeleteCategory}
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

export default DeleleCategoryModal;
