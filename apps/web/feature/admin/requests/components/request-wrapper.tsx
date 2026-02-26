"use client";

import React from "react";
import { useGetRequestById } from "../hooks/useRequest";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  IdCardIcon,
  Mail,
  Phone,
  Sunrise,
  Sunset,
  FlaskConicalIcon,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { getPublicUrl } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Icon } from "@iconify/react";
import { StatusBadge } from "@/components/shared/status-badge";

interface RequestWrapperProps {
  id: string;
}

const RequestWrapper = ({ id }: RequestWrapperProps) => {
  const { data: request, isLoading } = useGetRequestById(id);

  if (isLoading) return <div className="p-10 text-center text-muted-foreground">กำลังโหลดข้อมูล...</div>;
  if (!request) return <div className="p-10 text-center text-red-500">ไม่พบข้อมูลคำขอ</div>;

  const equipmentDetail = request.equipmentDetail;
  const labDetail = request.labBookingDetails;

  const requestDetailList = [
    {
      lable: "รหัสนักศึกษา",
      icon: <IdCardIcon size={15} />,
      value: request.studentId,
    },
    {
      lable: "อีเมล",
      icon: <Mail size={15} />,
      value: request.email,
    },
    {
      lable: "เบอร์โทรศัพท์",
      icon: <Phone size={15} />,
      value: request.phone,
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-10 md:grid-cols-8">
      {/* ส่วนข้อมูลนักศึกษา */}
      <div className="col-span-4 md:col-span-8">
        <div className="bg-primary w-fit rounded-tl-lg rounded-tr-lg px-5 py-2 font-bold text-white">
          ข้อมูลนักศึกษา
        </div>
        <div className="border-border flex w-full flex-col gap-4 border p-4 rounded-tr-md rounded-b-md">
          <div className="flex flex-col gap-1">
            <p className="text-primary flex items-center gap-3 text-3xl font-bold">
              {request.fullName}
              <Badge className="text-xs">{request.educationLevel}</Badge>
            </p>
            <p className="text-muted-foreground text-sm">สร้างเมื่อ: {new Date(request.createdAt).toLocaleString('th-TH')}</p>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {requestDetailList.map((item, i) => (
              <div className="flex flex-col gap-2" key={i}>
                <p className="text-muted-foreground flex items-center gap-2 text-xs">
                  {item.icon}
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
          <div className="border-border flex w-full flex-col gap-4 border p-6 rounded-tr-md rounded-b-md">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <p className="text-muted-foreground text-xs">ใช้ในวิชา</p>
                <div className="flex items-start gap-3">
                  <Badge>{equipmentDetail.course?.code}</Badge>
                  <p className="hidden text-sm md:block">
                    {equipmentDetail.course?.label}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-muted-foreground text-xs">อุปกรณ์อื่นๆ</p>
                <p className="text-sm">
                  {equipmentDetail.additionalItems || "ไม่มี"}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-muted-foreground text-xs">วัตถุประสงค์</p>
                <p className="text-sm">{equipmentDetail.purpose || "ไม่มี"}</p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-muted-foreground text-xs">สถานะ</p>
                <StatusBadge status={equipmentDetail.status} />
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-muted-foreground text-xs">ยืมวันที่</p>
                <p className="text-sm">
                  {new Date(equipmentDetail.borrowDate).toLocaleDateString("th-TH")}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-muted-foreground text-xs">คืนวันที่</p>
                <p className="text-sm">
                  {new Date(equipmentDetail.returnDate).toLocaleDateString("th-TH")}
                </p>
              </div>
            </div>

            <Separator />

            <h2 className="text-primary text-xl font-bold">รายการอุปกรณ์</h2>
            <ScrollArea className="h-80 px-4">
              <div className="mb-5 flex flex-col gap-6">
                {equipmentDetail.equipmentRequestItems.map((item, i) => (
                  <div key={item.id} className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-5">
                        <p className="text-muted-foreground">{i + 1}</p>
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
                      <p className="font-bold text-lg">x {item.quantity}</p>
                    </div>
                    <Separator />
                  </div>
                ))}
              </div>
            </ScrollArea>
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
          <div className="border-border flex w-full flex-col gap-4 border p-6 rounded-tr-md rounded-b-md">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <p className="text-muted-foreground text-xs">ใช้ในวิชา</p>
                <div className="flex items-start gap-3">
                  <Badge>{labDetail.course?.code}</Badge>
                  <p className="hidden text-sm md:block">
                    {labDetail.course?.label}
                  </p>
                </div>
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
                              src={getPublicUrl(item.laboratory?.image)}
                              alt="Item preview"
                              fill
                              className="rounded-sm object-cover"
                            />
                          </div>
                          <div className="space-y-1">
                            <p className="text-muted-foreground text-xs">
                              {item.laboratory?.labCode}
                            </p>

                            <p className="text-sm font-bold md:text-base">
                              {item.laboratory?.name}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 text-sm">
                        <h3 className="font-bold">รายละเอียดการจอง</h3>
                        <div className="flex items-center gap-3">
                          <p className="flex items-center gap-2">
                            <Calendar
                              size={15}
                              className="text-muted-foreground"
                            />
                            {new Date(item.bookingDate).toLocaleDateString("th-TH")}
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
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestWrapper;
