import InputForm from "@/components/shared/form-input";
import SelectedInput from "@/components/shared/selected-input";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { BorrowFormValues } from "@repo/schemas";
import { Upload } from "lucide-react";
import React, { useRef } from "react";
import { Controller, useFormContext } from "react-hook-form";

interface UserInformationProps {}

const UserInformation = ({}: UserInformationProps) => {
  const { control } = useFormContext<BorrowFormValues>();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerInputRef = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const educationLevels = [
    {
      id: 101,
      label: "ปริญญาตรี ชั้นปีที่ 1",
      value: "ug_year_1",
      group: "Undergraduate",
    },
    {
      id: 102,
      label: "ปริญญาตรี ชั้นปีที่ 2",
      value: "ug_year_2",
      group: "Undergraduate",
    },
    {
      id: 103,
      label: "ปริญญาตรี ชั้นปีที่ 3",
      value: "ug_year_3",
      group: "Undergraduate",
    },
    {
      id: 104,
      label: "ปริญญาตรี ชั้นปีที่ 4",
      value: "ug_year_4",
      group: "Undergraduate",
    },
    {
      id: 105,
      label: "ปริญญาตรี (ปีอื่นๆ)",
      value: "ug_others",
      group: "Undergraduate",
    },
    { id: 201, label: "ปริญญาโท", value: "master_degree", group: "Graduate" },
    {
      id: 202,
      label: "ปริญญาเอก",
      value: "doctoral_degree",
      group: "Graduate",
    },
  ];
  return (
    <div className="spac-y-4 px-0 md:px-24">
      <h1 className="text-2xl font-bold">กรอกข้อมูลผู้ยืม</h1>
      <Separator className="my-5" />
      <div className="">
        <div className="grid grid-cols-2 gap-5">
          <InputForm
            control={control}
            name="step1.fullName"
            label="ชื่อ-นามสกุล"
            required
            className="col-span-1"
            placeholder="สมชาย ใจดี"
          />
          <InputForm
            control={control}
            name="step1.studentId"
            label="รหัสนักศึกษา"
            required
            className="col-span-1"
            placeholder="66080xxx"
          />
          <InputForm
            control={control}
            name="step1.phone"
            label="เบอร์โทรศัพท์"
            required
            className="col-span-1"
            placeholder="081-xxx-xxxx"
          />
          <InputForm
            control={control}
            name="step1.email"
            label="อีเมลล์"
            required
            className="col-span-1"
            placeholder="example@mail.kmutt.ac.th"
          />

          <Controller
            control={control}
            name="step1.educationLevel"
            render={({ field }) => {
              const currentValue = educationLevels.find(
                (item) => item.value === field.value,
              );

              return (
                <SelectedInput
                  data={educationLevels}
                  placeholder="เลือกชั้นปี"
                  renderLabel={(item) => item.label}
                  getUniqueKey={(item) => item.label}
                  label="ชั้นปี"
                  selected={currentValue}
                  onSelected={(item) => field.onChange(item.value)}
                />
              );
            }}
          />

          <div className="col-span-2 flex flex-col gap-3">
            <h3 className="text-sm font-bold">แนบรูปบัตรนักศึกษา</h3>
            <span className="text-muted-foreground text-xs">
              ชื่อ-นามสกุล ผู้ขอใช้ห้อง ต้องตรงกับบนบัตรนักศึกษา
            </span>
            <Input ref={fileInputRef} type="file" hidden />
            <div
              onClick={triggerInputRef}
              className="text-primary border-border flex w-24 items-center justify-center gap-2 rounded-sm border p-2 text-sm hover:cursor-pointer"
            >
              <Upload size={14} />
              <span>เพิ่มไฟล์</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInformation;
