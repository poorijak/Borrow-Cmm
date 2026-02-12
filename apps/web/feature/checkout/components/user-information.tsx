import InputForm from "@/components/shared/form-input";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { BorrowFormValues } from "@repo/schemas";
import React from "react";
import { useFormContext } from "react-hook-form";

interface UserInformationProps {}

const UserInformation = ({}: UserInformationProps) => {
  const { control } = useFormContext<BorrowFormValues>();

  return (
    <div className="spac-y-4 px-32">
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
          />
          <InputForm
            control={control}
            name="step1.studentId"
            label="รหัสนักศึกษา"
            required
            className="col-span-1"
          />
          <InputForm
            control={control}
            name="step1.phone"
            label="เบอร์โทรศัพท์"
            required
            className="col-span-1"
          />
          <InputForm
            control={control}
            name="step1.email"
            label="อีเมลล์"
            required
            className="col-span-1"
          />
          {/* <SelectedInput /> */}

          <div>
            <h3 className="text-sm font-bold">แนบรูปบัตรนักศึกษา</h3>
            <span className="text-muted-foreground text-xs">
              ชื่อ-นามสกุล ผู้ขอใช้ห้อง ต้องตรงกับบนบัตรนักศึกษา
            </span>
            <Input type="file" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInformation;
