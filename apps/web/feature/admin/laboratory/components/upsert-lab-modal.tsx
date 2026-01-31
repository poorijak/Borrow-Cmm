"use client";

import InputForm from "@/components/shared/form-input";
import Modal from "@/components/shared/modal";
import SubmitBtn from "@/components/shared/submit-btn";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { getPublicUrl } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { laboratoryFormSchema, LaboratoryFormValue } from "@repo/schemas";
import { Laboratory } from "@repo/types";
import { Save, Trash2 } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutateLab } from "../hooks/useLaboratory";

interface UpsertLabModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lab?: Laboratory;
}

const UpsertLabModal = ({ open, onOpenChange, lab }: UpsertLabModalProps) => {
  const [existingRemove, setExistingRemove] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const { mutate, isPending } = useMutateLab();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const imageSrc: string | undefined = preview
    ? preview
    : !existingRemove && lab?.image
      ? getPublicUrl(lab.image)
      : undefined;

  const form = useForm<LaboratoryFormValue>({
    resolver: zodResolver(laboratoryFormSchema),
    defaultValues: lab
      ? {
          name: lab.name,
          labCode: lab.labCode,
          imageKey: lab.image,
          imageFile: undefined,
          status: lab.status,
        }
      : {
          name: "",
          labCode: ":",
          imageKey: "",
          imageFile: undefined,
          status: "active",
        },
  });

  useEffect(() => {
    if (!open) return;

    if (lab) {
      form.reset({
        name: lab.name,
        labCode: lab.labCode,
        imageKey: lab.image,
        imageFile: undefined,
        status: lab.status,
        labId: lab.id,
      });

      setExistingRemove(false);
      setPreview(null);
    } else {
      form.reset({
        name: "",
        labCode: "",
        imageKey: "",
        imageFile: undefined,
        status: "active",
      });

      setExistingRemove(false);
      setPreview(null);
    }
  }, [form, lab, open]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    form.setValue("imageFile", file, { shouldDirty: true });

    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const handleSubmit = (data: LaboratoryFormValue) => {
    mutate(data, {
      onSuccess: () => {
        handleRemoveImage();
        form.reset({
          name: "",
          labCode: "",
          imageFile: undefined,
          status: "active",
        });
        onOpenChange(false);
      },
    });
  };

  const handleRemoveImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
      form.setValue("imageFile", undefined, { shouldDirty: true });
      return;
    }

    setExistingRemove(true);
    form.setValue("imageKey", undefined, { shouldDirty: true });
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={
        lab
          ? `แก้ไขข้อมูลห้องปฏิบัติการ ${lab.name}`
          : "เพิ่มห้องปฎิบัติการใหม่"
      }
    >
      <div className="space-y-5">
        {imageSrc ? (
          <div className="relative h-48 w-full cursor-pointer overflow-hidden rounded-lg border">
            <Image
              alt="Preview-category"
              src={imageSrc}
              fill
              unoptimized
              className="object-contain"
            />
            <div
              className="text-destructive absolute top-4 right-4"
              onClick={handleRemoveImage}
            >
              <Trash2 size={20} />
            </div>
          </div>
        ) : (
          <div
            className="flex items-center justify-center border border-dashed py-8 hover:cursor-pointer"
            onClick={triggerFileInput}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center justify-center rounded-full">
                <Icon className="size-20" icon="fluent-color:image-48" />
              </div>
              <div className="flex flex-col gap-1 text-center text-xs">
                <p className="text-blue-800">
                  Drop your image here or{" "}
                  <span className="text-primary font-bold">upload</span>
                </p>
                <span className="text-muted-foreground/60 text-[10px]">
                  Support PNG , JPG , JPEG , WEBP
                </span>
              </div>
            </div>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <input
              hidden
              accept="image/*"
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
            />
            <div className="space-y-5">
              <InputForm
                control={form.control}
                name="name"
                label="ชื่อห้องปฏิบัติการ"
                placeholder="กรอกชื่อ เช่น ห้องคอม mac"
              />
              <InputForm
                control={form.control}
                name="labCode"
                label="รหัสห้องปฏิบัติการ"
                placeholder="กรอกชื่อ เช่น ห้องคอม mac"
              />
              <SubmitBtn
                disabled={isPending}
                title="บันทึก"
                icon={Save}
                className="w-full"
              />
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};

export default UpsertLabModal;
