import Modal from "@/components/shared/modal";
import SubmitBtn from "@/components/shared/submit-btn";
import { Button } from "@/components/ui/button";
import { TriangleAlert } from "lucide-react";
import React, { useEffect } from "react";
import { useDeleteSubCategory } from "../hooks/useSubCate";

interface DeleteSubCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: {
    id: string;
    title: string;
  };
}

const DeleteSubCategoryModal = ({
  open,
  onOpenChange,
  data,
}: DeleteSubCategoryModalProps) => {
  const { mutate, isPending, isSuccess } = useDeleteSubCategory();

  const handleDeleteSubCategory = () => {
    mutate(data.id);
  };

  useEffect(() => {
    if (isSuccess) {
      onOpenChange(false);
    }
  }, [isSuccess, onOpenChange]);

  return (
    <Modal onOpenChange={onOpenChange} open={open} size="sm">
      <div className="flex justify-center gap-3 flex-col  items-center">
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

        <div className="flex items-center w-full flex-col mt-5 gap-10">
          <Button
            variant="outline"
            size="lg"
            onClick={() => onOpenChange(false)}
          >
            ไม่ เก็บไว้ก่อน
          </Button>
          <SubmitBtn
            variant="destructive"
            size="lg"
            onClick={handleDeleteSubCategory}
            title="ใช่ ลบเลย"
            pending={isPending}
          />
        </div>
      </div>
    </Modal>
  );
};

export default DeleteSubCategoryModal;
