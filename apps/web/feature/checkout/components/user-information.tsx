import InputForm from "@/components/shared/form-input";
import SelectedInput from "@/components/shared/selected-input";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { BorrowFormValues } from "@repo/schemas";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

const UserInformation = () => {
  const [preview, setPreview] = useState<{
    url: string;
    fileName: string;
  } | null>(null);
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<BorrowFormValues>();

  const idCardFile = watch("step1.idCardImageFile");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (idCardFile instanceof File) {
      const url = URL.createObjectURL(idCardFile);
      setPreview({ url: url, fileName: idCardFile.name });

      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(null);
    }
  }, [idCardFile]);

  const triggerInputRef = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handelImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setValue("step1.idCardImageFile", file, { shouldDirty: true });

    const url = URL.createObjectURL(file);
    setPreview({ fileName: file.name, url });
  };

  const handleRemoveImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    if (preview) {
      URL.revokeObjectURL(preview.url);
      setPreview(null);
      setValue("step1.idCardImageFile", undefined as any, {
        shouldDirty: true,
      });
      return;
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
    <div className="spac-y-4">
      <h1 className="text-2xl font-bold">กรอกข้อมูลผู้ยืม</h1>
      <Separator className="my-5" />
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
          render={({ field, fieldState }) => {
            const currentValue = educationLevels.find(
              (item) => item.value === field.value,
            );

            return (
              <div>
                <SelectedInput
                  error={fieldState.error}
                  data={educationLevels}
                  placeholder="เลือกชั้นปี"
                  renderLabel={(item) => item.label}
                  getUniqueKey={(item) => item.label}
                  label="ชั้นปี"
                  selected={currentValue}
                  onSelected={(item) => field.onChange(item.label)}
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

        <div className="col-span-2 flex flex-col gap-3">
          <h3 className="text-sm font-bold">แนบรูปบัตรนักศึกษา</h3>
          <span className="text-muted-foreground text-xs">
            ชื่อ-นามสกุล ผู้ขอใช้ห้อง ต้องตรงกับบนบัตรนักศึกษา
          </span>
          {preview && preview.url.length > 0 ? (
            <div className="border-border group flex w-fit items-center gap-3 rounded-md border p-3">
              <div className="relative aspect-square size-5 rounded-md">
                <Image
                  src={preview.url}
                  fill
                  className="rounded-xs object-cover"
                  alt="preview-url"
                />
              </div>
              <p className="text-sm">{preview.fileName}</p>
              <X
                onClick={handleRemoveImage}
                className="text-muted-foreground hover:text-primary size-5 transition-colors duration-75 hover:cursor-pointer"
              />
            </div>
          ) : (
            <div>
              <Input
                ref={fileInputRef}
                onChange={handelImageChange}
                type="file"
                accept="image/*"
                hidden
              />
              <div
                onClick={triggerInputRef}
                className="text-primary border-border flex w-24 items-center justify-center gap-2 rounded-sm border p-2 text-sm hover:cursor-pointer"
              >
                <Upload size={14} />
                <span>เพิ่มไฟล์</span>
              </div>
            </div>
          )}

          {errors.step1?.idCardImageFile && (
            <p className="text-destructive text-[12px] font-medium">
              {String(errors.step1.idCardImageFile.message)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInformation;
