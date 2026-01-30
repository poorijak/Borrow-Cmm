import Modal from "@/components/shared/modal";
import { Button } from "@/components/ui/button";
import { TriangleAlert } from "lucide-react";
import React, { useEffect } from "react";
import SubmitBtn from "@/components/shared/submit-btn";
import { Course, Equipment } from "@repo/types";
import { useDeleteCourse } from "../hooks/useCourse";

type DeleteCourseProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: Course | undefined;
};

const DeleteCourseModal = ({ open, onOpenChange, data }: DeleteCourseProps) => {
  const { mutate, isPending, isSuccess } = useDeleteCourse();

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
          <span className="text-base font-bold">
            คุณต้องการลบรายวิชา{" "}
            <span className="text-destructive">{data?.label}</span> ใช่หรือไม่?
          </span>
          <p className="text-muted-foreground text-center text-xs">
            การลบรายวิชาจะไม่ส่งผลต่อข้อมูลอื่นที่เกี่ยวข้อง
            แต่รายวิชานี้จะไม่สามารถใช้งานได้อีกต่อไป
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

export default DeleteCourseModal;
