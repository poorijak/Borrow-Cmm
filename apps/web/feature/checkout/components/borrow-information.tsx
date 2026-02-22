"use client";

import InputForm from "@/components/shared/form-input";
import SelectedInput from "@/components/shared/selected-input";
import { Separator } from "@/components/ui/separator";
import { BorrowFormValues } from "@repo/schemas";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useGetCourse, useGetInstrutor } from "../hooks/useCheckout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Sunrise, Sunset } from "lucide-react";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BagEquipmentItem, BagLabItem } from "@repo/types";
import { cn, getPublicUrl } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BorrowInformationProps {
  equipmentItem?: BagEquipmentItem[];
  labItem?: BagLabItem[];
}

const BorrowInformation = ({
  equipmentItem,
  labItem,
}: BorrowInformationProps) => {
  const { control } = useFormContext<BorrowFormValues>();

  const isLabInfo = labItem && labItem.length > 0;
  const isEquipmentInfo = equipmentItem && equipmentItem.length > 0;

  const { data: courseData } = useGetCourse();

  const { data: instrutorData } = useGetInstrutor();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">
        {isLabInfo ? "การจองห้องปฏิบัติการ" : "การยืมอุปกรณ์"}
      </h1>
      <Separator className="my-5" />


      <div className="flex flex-col-reverse gap-10 md:grid md:grid-cols-8">
        <div className="col-span-1 grid grid-cols-2 gap-5 md:col-span-5">
          <div className="col-span-2 md:col-span-1">
            <Controller
              key={isLabInfo ? "lab-subject" : "equip-subject"}
              control={control}
              name={isLabInfo ? "lab.subjectId" : "equipment.subjectId"}
              render={({ field, fieldState }) => {
                return (
                  <div>
                    <SelectedInput
                      error={fieldState.error}
                      label="ใช้ในรายวิชา"
                      data={courseData}
                      selected={courseData?.find((c) => c.id === field.value)}
                      placeholder="เลือกวิชาที่เกี่ยวข้อง เช่น CMM001"
                      require
                      renderLabel={(item) => item.displayName}
                      onSelected={(item) => {
                        field.onChange(item.id);
                      }}
                      getUniqueKey={(item) => item.displayName}
                    />
                    {fieldState.error && (
                      <span className="ml-1 text-[11px] font-medium text-red-500">
                        *{fieldState.error.message}
                      </span>
                    )}
                  </div>
                );
              }}
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <Controller
              key={isLabInfo ? "lab-subject" : "equip-subject"}
              control={control}
              name={isLabInfo ? "lab.teacherId" : "equipment.teacherId"}
              render={({ field, fieldState }) => {
                return (
                  <div className="w-full">
                    <Label
                      className={cn(
                        "mb-2",
                        fieldState.error && "text-destructive",
                      )}
                    >
                      อาจารย์ประจำวิชาที่มอบหมายงาน
                      <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <SelectTrigger
                        className={cn(
                          "w-full",
                          fieldState.error &&
                            "border-destructive focus:ring-destructive",
                        )}
                      >
                        <SelectValue placeholder="ระบุอาจารย์ที่ประจำวิชา" />
                      </SelectTrigger>
                      <SelectContent>
                        {instrutorData?.map((instrutor) => (
                          <SelectItem key={instrutor.id} value={instrutor.id}>
                            <div className="flex items-center gap-3">
                              <div className="relative aspect-square size-5">
                                <Image
                                  src={instrutor.profileImage}
                                  fill
                                  alt="profileImage "
                                  className="rounded-full object-cover"
                                />
                              </div>
                              {instrutor.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.error && (
                      <span className="ml-1 text-[11px] font-medium text-red-500">
                        *{fieldState.error.message}
                      </span>
                    )}
                  </div>
                );
              }}
            />
          </div>
          {isEquipmentInfo ? (
            <>
              <InputForm
                control={control}
                name="equipment.purpose"
                key={isLabInfo ? "lab-subject" : "equip-subject"}
                label="ยืมอุปกรณ์เพื่อใช้สำหรับ"
                placeholder="ระบุวัตถุประสงค์ เช่น ใช้ทำโปรเจกต์วิชา Hardware"
                type="textArea"
                className="col-span-2"
              />
              <InputForm
                control={control}
                name="equipment.additionalItems"
                label="ถ้าไม่มีในรายการโปรดระบุ"
                placeholder="ระบุรายการอุปกรณ์ที่ต้องการยืมเพิ่มเติม (ถ้ามี)"
                type="textArea"
                className="col-span-2"
              />
            </>
          ) : (
            <>
              <InputForm
                control={control}
                name="lab.usageDetails"
                key={isLabInfo ? "lab-subject" : "equip-subject"}
                label="รายละเอียดการใช้ห้อง"
                placeholder="ระบุวัตถุประสงค์ เช่น ใช้ทำโปรเจกต์วิชา Hardware"
                type="textArea"
                required
                className="col-span-2"
              />
              <InputForm
                control={control}
                name="lab.memberNames"
                label="รายชื่อนักศึกษาที่เข้าใช้ห้อง"
                placeholder="ระบุรายชื่อสมาชิกในกลุ่มที่เข้าใช้ห้องในเวลาเดียวกันทั้งหมด สำหรับห้องคอมพิวเตอร์ ต้องมีผู้เข้าใช้ห้องอย่างน้อย 8 คนขึ้นไป"
                type="textArea"
                className="col-span-2"
              />
            </>
          )}
          {isEquipmentInfo && (
            <div className="space-y-2">
              <Label>
                วันที่ยืม - กำหนดส่งคืน <span className="text-red-500">*</span>
              </Label>
              <Controller
                control={control}
                name="equipment.borrowRange"
                render={({ field, fieldState }) => (
                  <div className="flex flex-col gap-2">
                    <Popover>
                      <PopoverTrigger
                        asChild
                        className={cn(
                          "w-auto",
                          fieldState.error &&
                            "border-destructive focus:ring-destructive",
                        )}
                      >
                        <Button
                          variant="outline"
                          size="lg"
                          className="justify-start text-left font-normal"
                        >
                          <CalendarIcon
                            className={cn(
                              fieldState.error && "text-destructive",
                            )}
                          />
                          {field.value?.from ? (
                            field.value.to ? (
                              <>
                                {format(field.value.from, "dd MMM yyyy", {
                                  locale: th,
                                })}{" "}
                                -{" "}
                                {format(field.value.to, "dd MMM yyyy", {
                                  locale: th,
                                })}
                              </>
                            ) : (
                              format(field.value.from, "dd MMM yyyy", {
                                locale: th,
                              })
                            )
                          ) : (
                            <span
                              className={cn(
                                fieldState.error && "text-destructive",
                              )}
                            >
                              เลือกวันที่ยืม-คืน
                            </span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto" align="start">
                        <Calendar
                          mode="range"
                          defaultMonth={field.value?.from}
                          selected={field.value}
                          onSelect={field.onChange}
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                    {fieldState.error && (
                      <span className="ml-1 text-[11px] font-medium text-red-500">
                        *กรุณาเลือกวันที่ยืม-คืน
                      </span>
                    )}
                  </div>
                )}
              />
            </div>
          )}
        </div>
        <div className="col-span-1 flex flex-col gap-4 md:col-span-3">
          <h1 className="text-xl text-primary font-bold">
            {isLabInfo ? "ห้องปฏิบัติการ" : "อุปกรณ์"}
          </h1>
          <Separator />
          <ScrollArea className="h-60 pr-4">
            <div className="mb-5 flex flex-col gap-6">
              {isEquipmentInfo &&
                equipmentItem
                  .filter((item) => item.isSelected === true)
                  .map((item, i) => (
                    <div
                      key={item.equipment.id}
                      className="flex flex-col gap-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-5">
                          <p>{i + 1}</p>
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
                        <p>x {item.itemCount}</p>
                      </div>
                      <Separator />
                    </div>
                  ))}

              {isLabInfo &&
                labItem?.map(({ id, laboratory, ...labItem }, index) => (
                  <div key={id} className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-5">
                        <p>{index + 1}</p>
                        <div className="relative aspect-square size-12 rounded-sm bg-slate-100 md:size-12">
                          <Image
                            src={getPublicUrl(laboratory?.image)}
                            alt="Item preview"
                            fill
                            className="rounded-sm object-cover"
                          />
                        </div>
                        <div className="space-y-1">
                          <p className="text-muted-foreground text-xs">
                            {laboratory.labCode}
                          </p>
                          <p className="text-sm font-bold md:text-base">
                            {laboratory.name}
                          </p>

                          <p className="text-sm">
                            <span
                              className={cn(
                                "text-xs md:text-sm",
                                laboratory?.status
                                  ? "text-destructive"
                                  : "text-primary",
                              )}
                            >
                              {laboratory?.status
                                ? "ห้องนี้ไม่ว่างแล้ว"
                                : "ห้องยังว่างอยู่"}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <Separator />
                    <div className="ml-8 flex flex-col gap-2 text-sm">
                      <h3 className="font-bold">รายละเอียด</h3>
                      <div className="flex items-center gap-3">
                        <p className="flex items-center gap-2">
                          <CalendarIcon
                            size={15}
                            className="text-muted-foreground"
                          />
                          {format(labItem!.date, "PPP", { locale: th })}
                        </p>
                        <div>
                          {labItem?.slot === "afternoon" ? (
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
                ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default BorrowInformation;
