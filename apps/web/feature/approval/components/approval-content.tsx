"use client";

import React, { useState } from "react";
import { ApproveRequest, FindRequestApprovalResponse } from "@repo/types";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Check,
  FlaskConical,
  FlaskConicalIcon,
  IdCardIcon,
  Mail,
  Phone,
  Sunrise,
  Sunset,
  XCircle,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { getPublicUrl } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { ApprovalModal } from "./approval-modal";
import { formatEqupmentStatus } from "@/lib/format/format";
import { StatusBadge } from "@/components/shared/status-badge";

interface ApprovalContentProps {
  token: string;
  request: FindRequestApprovalResponse;
}

const ApprovalContent = ({ request, token }: ApprovalContentProps) => {
  const requestDetail = request.request;
  const equipmentDetail = request.equipmentDetail;
  const labDetail = request.labDetail;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTypeSelected, setIsTypeSelected] = useState<
    "equipment" | "laboratory"
  >();
  const [isActionSelected, setIsActionSelected] = useState<ApproveRequest>();

  const handleSelecteAction = (
    type: "equipment" | "laboratory",
    status: ApproveRequest,
  ) => {
    setIsModalOpen(true);
    setIsTypeSelected(type);
    setIsActionSelected(status);
  };

  const requestDetailList = [
    {
      lable: "รหัสนักศึกษา",
      icon: <IdCardIcon size={15} />,
      value: requestDetail.studentId,
    },
    {
      lable: "อีเมล",
      icon: <Mail size={15} />,
      value: requestDetail.email,
    },
    {
      lable: "เบอร์โทรศัพท์",
      icon: <Phone size={15} />,
      value: requestDetail.phone,
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-10 md:grid-cols-8">
      {/* ส่วนข้อมูลนักศึกษา */}
      <div className="col-span-4 md:col-span-8">
        <div className="bg-primary w-fit rounded-tl-lg rounded-tr-lg px-5 py-2 font-bold text-white">
          ข้อมูลนักศึกษา
        </div>
        <div className="border-border flex w-full flex-col gap-4 rounded-tr-md rounded-b-md border p-4">
          <p className="text-primary flex items-center gap-3 text-3xl font-bold">
            {requestDetail.fullName}
            <Badge className="text-xs">{requestDetail.educationLevel}</Badge>
          </p>
          <Separator />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {requestDetailList.map((item, i) => (
              <div className="flex flex-col gap-2" key={i}>
                <p className="text-muted-foreground flex items-center gap-2 text-xs">
                  {item.lable}
                </p>
                <p className="text-sm font-bold">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ส่วนการยืมอุปกรณ์ */}
      {equipmentDetail && (
        <div className="col-span-4">
          <div className="bg-primary flex w-fit items-center gap-3 rounded-tl-lg rounded-tr-lg px-5 py-2 font-bold text-white">
            <span>
              <Icon icon="streamline-plump:lens-remix" />
            </span>
            ข้อมูลการยืมอุปกรณ์
          </div>
          <div className="border-border flex w-full flex-col gap-4 rounded-tr-md rounded-b-md border p-6">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <p className="text-muted-foreground text-xs">ใช้ในวิชา</p>
                <p className="text-sm">{equipmentDetail.subjectId}</p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-muted-foreground text-xs">อุปกรณ์อื่นๆ</p>
                <p className="text-sm">
                  {equipmentDetail.additionalItems || "ไม่มี"}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-muted-foreground text-xs">ยืมวันที่</p>
                <Badge className="bg-[#DCFAE9] px-2 py-1 text-green-600">
                  {equipmentDetail.borrowDate}
                </Badge>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-muted-foreground text-xs">คืนวันที่</p>
                <Badge className="bg-red-100 px-2 py-1 text-red-600">
                  {equipmentDetail.returnDate}
                </Badge>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-muted-foreground text-xs">สถานะ</p>
                <StatusBadge status={equipmentDetail.status} />
              </div>
            </div>

            <Separator />

            <h2 className="text-primary text-xl font-bold">อุปกรณ์</h2>
            <ScrollArea className="h-80 px-4">
              <div className="mb-5 flex flex-col gap-6">
                {equipmentDetail.equipmentRequestItems.map((item) => (
                  <div key={item.equipment.id} className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-5">
                        <div className="relative aspect-square size-12 rounded-sm bg-slate-100 md:size-12">
                          <Image
                            src={getPublicUrl(item.equipment?.mainImage)}
                            alt="Item preview"
                            fill
                            className="rounded-sm object-cover"
                          />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-bold md:text-base">
                            {item.equipment?.title}
                          </p>
                          <p className="text-sm">
                            คงเหลือ{" "}
                            <span className="text-primary">
                              {item.equipment?.totalStock}
                            </span>
                          </p>
                        </div>
                      </div>
                      <p>x {item.quantity}</p>
                    </div>
                    <Separator />
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="flex w-full items-center justify-center gap-4">
              <Button
                onClick={() => handleSelecteAction("equipment", "approved")}
                className="w-6/12"
              >
                <Check size={18} />
                อนุมัติคำขอ
              </Button>
              <Button
                onClick={() => handleSelecteAction("equipment", "rejected")}
                className="w-6/12"
                variant="outline"
              >
                <XCircle size={18} />
                ไม่อนุมัติ
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ส่วนการจองห้องแล็บ */}
      {labDetail && labDetail.labBookings.length > 0 && (
        <div className="col-span-4">
          <div className="bg-primary flex w-fit items-center gap-3 rounded-tl-lg rounded-tr-lg px-5 py-2 font-bold text-white">
            <FlaskConicalIcon size={18} />
            ข้อมูลการใช้ห้องแล็บ
          </div>
          <div className="border-border flex w-full flex-col gap-4 rounded-tr-md rounded-b-md border p-6">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <p className="text-muted-foreground text-xs">ใช้ในวิชา</p>
                <p className="text-sm">{labDetail.subjectId}</p>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-muted-foreground text-xs">ใช้สำหรับ</p>
                <p className="text-sm">{labDetail.usageDetails}</p>
              </div>

              <div className="col-span-2 flex flex-col gap-2">
                <p className="text-muted-foreground text-xs">
                  รายชื่อผู้ใช้ห้อง
                </p>
                <p className="text-sm">{labDetail.memberNames || "ไม่มี"}</p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-muted-foreground text-xs">สถานะ</p>
                <StatusBadge status={labDetail.status} />
              </div>
            </div>
            <Separator />
            <h2 className="text-primary text-xl font-bold">ห้องปฏิบัติการ</h2>
            <ScrollArea className="h-80">
              <div className="flex flex-col gap-5">
                {labDetail.labBookings.map((item) => (
                  <div key={item.id} className="flex flex-col gap-3">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-5">
                          <div className="relative aspect-square size-12 rounded-sm bg-slate-100 md:size-16">
                            <Image
                              src={getPublicUrl(item.laboratory.image)}
                              alt="Item preview"
                              fill
                              className="rounded-sm object-cover"
                            />
                          </div>
                          <div className="space-y-1">
                            <p className="text-muted-foreground text-xs">
                              {item.laboratory.labCode}
                            </p>

                            <p className="text-sm font-bold md:text-base">
                              {item.laboratory.name}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 text-sm">
                        <h3 className="font-bold">รายละเอียด</h3>
                        <div className="flex items-center gap-3">
                          <p className="flex items-center gap-2">
                            <Calendar
                              size={15}
                              className="text-muted-foreground"
                            />
                            {item.bookingDate}
                          </p>
                          <div>
                            {item.slot === "afternoon" ? (
                              <div className="flex items-center gap-2">
                                <Sunset
                                  size={15}
                                  className="text-muted-foreground"
                                />
                                <span>ช่วงบ่าย</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <Sunrise
                                  size={15}
                                  className="text-muted-foreground"
                                />
                                <span>ช่วงเช้า</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <Separator />
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="flex w-full items-center justify-center gap-4">
              <Button
                className="w-6/12"
                onClick={() => handleSelecteAction("laboratory", "approved")}
              >
                <Check size={18} />
                อนุมัติคำขอ
              </Button>
              <Button
                onClick={() => handleSelecteAction("laboratory", "rejected")}
                className="w-6/12"
                variant="outline"
              >
                <XCircle size={18} />
                ไม่อนุมัติ
              </Button>
            </div>
          </div>
        </div>
      )}

      <ApprovalModal
        token={token}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        type={isTypeSelected}
        status={isActionSelected}
        studentName={requestDetail.fullName}
      />
    </div>
  );
};

export default ApprovalContent;
