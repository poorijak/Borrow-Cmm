"use client";

import Modal from "@/components/shared/modal";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"; // ถ้ามี shadcn textarea
import React, { useEffect, useState } from "react";
import { useUpdateRequest } from "../hooks/useApproval";
import { toast } from "sonner";
import { ApproveRequest } from "@repo/types";

interface ApprovalModalProps {
  token: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  status?: ApproveRequest;
  type?: "equipment" | "laboratory";
  studentName?: string; // เพิ่มเพื่อความเฉพาะเจาะจง
}

export const ApprovalModal = ({
  token,
  open,
  onOpenChange,
  status,
  type,
  studentName = "นักศึกษา",
}: ApprovalModalProps) => {
  const { mutate, isPending } = useUpdateRequest();
  const [reason, setReason] = useState("");
  const isApprove = status === "approved";
  const isLab = type === "laboratory";

  useEffect(() => {
    if (!open) setReason("");
  }, [open]);

  const getTargetText = () => (isLab ? "การเข้าใช้ห้องแล็บ" : "การยืมอุปกรณ์");

  const handleMuate = () => {
    if (!type || !status || !token) {
      console.error("Missing required fields");
      return;
    }

    if (!isApprove && !reason.trim()) {
      toast.error("กรุณากรอกเหตุผลที่ปฏิเสธคำขอ");
    }
    mutate(
      { token, status, type, remark: reason },
      { onSuccess: () => onOpenChange(false) },
    );
  };

  return (
    <Modal
      onOpenChange={onOpenChange}
      open={open}
      title={
        isApprove
          ? `ยืนยันอนุมัติ${getTargetText()}`
          : `ปฏิเสธ${getTargetText()}`
      }
    >
      <div className="flex flex-col gap-4">
        {isApprove ? (
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm">
              คุณกำลังจะอนุมัติ{" "}
              <span className="text-foreground font-bold">
                {getTargetText()}
              </span>{" "}
              ของ <span className="text-primary font-bold">{studentName}</span>
            </p>
            <p className="text-sm">
              {isLab
                ? "เมื่ออนุมัติแล้ว ตารางเวลาของห้องจะถูกล็อคให้ผู้ใช้นี้ทันที"
                : "เมื่ออนุมัติแล้ว ระบบจะตัดจำนวนอุปกรณ์ออกจากคลังสินค้า"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-muted-foreground text-sm">
              ระบุเหตุผลที่ปฏิเสธ{" "}
              <span className="text-foreground font-bold">
                {getTargetText()}
              </span>{" "}
              เพื่อแจ้งให้นักศึกษาทราบ
            </p>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={
                isLab
                  ? "เช่น ห้องไม่พร้อมใช้งานในวันดังกล่าว"
                  : "เช่น อุปกรณ์ชำรุดหรือข้อมูลไม่ครบถ้วน"
              }
              className="min-h-[100px]"
            />
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <Button
            disabled={isPending}
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            ยกเลิก
          </Button>
          <Button
            disabled={isPending}
            onClick={handleMuate}
            variant={isApprove ? "default" : "destructive"}
          >
            {isApprove ? "ยืนยันอนุมัติ" : "ยืนยันการปฏิเสธ"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
