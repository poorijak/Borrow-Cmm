"use client";

import InputForm from "@/components/shared/form-input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Icon } from "@iconify/react";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { equipmentFormSchema, EquipmentFormValue } from "@repo/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Equipment } from "@repo/types";
import { cn, getPublicUrl } from "@/lib/utils";
import SelectedInput from "@/components/shared/selected-input";
import { useGetSubCategories } from "../../subCategory/hooks/useSubCate";
import { useGetCategories } from "../../equipmentCategory/hooks/useCategory";
import SubmitBtn from "@/components/shared/submit-btn";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useEquipment } from "../hooks/useEquipment";
import { Label } from "@/components/ui/label";

interface UpsetEquipmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "equipmentPage" | "equipmentWithCate";
  data?: Equipment;
  mainCateId?: string;
}

const UpsetEquipmentModal = ({
  type,
  onOpenChange,
  open,
  data: equipment,
  mainCateId,
}: UpsetEquipmentModalProps) => {
  const [isCategoryId, setIsCategoryId] = useState<string>(mainCateId || "");
  const [existingRemove, setExistingRemove] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isActiveTab, setIsActiveTab] = useState("รายละเอียด");
  const { mutate, isPending } = useEquipment();

  // fetching Data
  const { data: categoriesData } = useGetCategories(1, 99);

  const { data: subCategoryData } = useGetSubCategories(isCategoryId, 1, 999);

  // tabs list
  const tabsList = [
    {
      icon: <Icon icon="mynaui:one-circle" />,
      title: "รายละเอียด",
      value: "รายละเอียด",
    },
    {
      icon: <Icon icon="mynaui:two-circle" />,
      title: "จำนวนอุปกรณ์",
      value: "จำนวนอุปกรณ์",
    },
  ];

  // var
  const imageSrc: string | undefined = preview
    ? preview
    : !existingRemove && equipment?.mainImage
      ? getPublicUrl(equipment.mainImage)
      : undefined;

  // form Section
  const form = useForm<EquipmentFormValue>({
    resolver: zodResolver(equipmentFormSchema),
    defaultValues: equipment
      ? {
          title: equipment.title,
          imageKey: equipment.mainImage,
          totalStock: equipment.totalStock,
          status: equipment.status,
          subCategoryId: equipment.subCategory.id,
          mainCategoryId: equipment.mainCategory.id,
          eqiupmentId: equipment.id,
        }
      : {
          title: "",
          imageFile: undefined,
          totalStock: 0,
          status: "active",
          subCategoryId: "",
          mainCategoryId: "",
        },
    mode: "onSubmit",
  });

  useEffect(() => {
    if (!open) return;

    if (equipment) {
      form.reset({
        title: equipment.title,
        imageKey: equipment.mainImage,
        imageFile: undefined,
        totalStock: equipment.totalStock,
        status: equipment.status,
        subCategoryId: equipment.subCategory.id,
        mainCategoryId: equipment.mainCategory.id,
        description: equipment.description ?? "",
        eqiupmentId: equipment.id,
      });

      setIsCategoryId(equipment.mainCategory.id);
      setExistingRemove(false);
      setPreview(null);
      setIsActiveTab("รายละเอียด");
    } else {
      form.reset({
        title: "",
        imageKey: undefined,
        imageFile: undefined,
        totalStock: 0,
        status: "active",
        subCategoryId: "",
        mainCategoryId: mainCateId ?? "",
        description: "",
      });

      setIsCategoryId(mainCateId ?? "");
      setExistingRemove(false);
      setPreview(null);
      setIsActiveTab("รายละเอียด");
    }
  }, [equipment, open, mainCateId, form]);

  // handle function
  const handleSubmit = (data: EquipmentFormValue) => {
    mutate(data, {
      onSuccess: () => {
        handleRemoveImage();
        form.reset({
          title: "",
          imageFile: undefined,
          totalStock: 0,
          status: "active",
          subCategoryId: "",
          mainCategoryId: "",
        });
        onOpenChange(false);
      },
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];

    if (!file) return;

    form.setValue("imageFile", file, { shouldDirty: true });

    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const handleNext = async () => {
    const isFristPageValue = await form.trigger([
      "title",
      "subCategoryId",
      "description",
    ]);

    if (isFristPageValue) {
      setIsActiveTab("จำนวนอุปกรณ์");
    }
  };

  const handleRemoveImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
      form.setValue("imageFile", undefined as any, { shouldDirty: true });
      return;
    }
    setExistingRemove(true);
    form.setValue("imageKey", undefined as any, { shouldDirty: true });
  };
  // useRef section
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>เพิ่มอุปกรณ์ใหม่</DialogTitle>
          <DialogDescription> </DialogDescription>
        </DialogHeader>
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
          <Tabs
            className="w-full"
            value={isActiveTab}
            onValueChange={setIsActiveTab}
          >
            <TabsList className="text-muted-foreground mb-3 inline-flex h-8 w-full items-center justify-start rounded-none border-b bg-transparent p-0">
              {tabsList.map((t, i) => (
                <TabsTrigger
                  key={i}
                  value={t.value}
                  className="ring-offset-background focus-visible:ring-ring data-[state=active]:bg-background text-muted-foreground data-[state=active]:border-b-primary data-[state=active]:text-primary relative inline-flex h-8 items-center justify-center rounded-none border-b-2 border-b-transparent bg-transparent px-4 py-1 pt-2 pb-3 text-sm font-medium whitespace-nowrap shadow-none transition-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=active]:font-semibold data-[state=active]:shadow-none"
                >
                  <span>{t.icon}</span>
                  {t.title}
                </TabsTrigger>
              ))}
              <div className="flex-1 border-b border-transparent"></div>
            </TabsList>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                onChange={() => form.clearErrors()}
              >
                <TabsContent value="รายละเอียด">
                  <input
                    hidden
                    accept="image/*"
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <InputForm
                      control={form.control}
                      label="ชื่อ"
                      placeholder="ระบุชื่ออุปกรณ์และรุ่น..."
                      name="title"
                      className={cn(
                        type === "equipmentPage" ? "col-span-2" : "col-span-1",
                      )}
                      required
                    />

                    {type === "equipmentPage" && (
                      <Controller
                        name="mainCategoryId"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <div className="col-span-1">
                            <SelectedInput
                              data={categoriesData?.data}
                              selected={categoriesData?.data.find(
                                (c) => c.id === field.value,
                              )}
                              placeholder="เลือกหมวดหมู่หลัก"
                              renderLabel={(item) => item.title}
                              onSelected={(item) => {
                                field.onChange(item.id);
                                setIsCategoryId(item.id);
                                form.setValue("subCategoryId", "");
                              }}
                              getUniqueKey={(item) => item.title}
                              label="หมวดหมู่หลัก"
                            />
                            {fieldState.error && (
                              <span className="ml-1 text-[11px] font-medium text-red-500">
                                *{fieldState.error.message}
                              </span>
                            )}
                          </div>
                        )}
                      />
                    )}

                    <div
                      className={cn(
                        type === "equipmentPage" ? "col-span-1" : "col-span-1",
                      )}
                    >
                      <Controller
                        name="subCategoryId"
                        control={form.control}
                        rules={{ required: "เลือก" }}
                        render={({ field, fieldState }) => {
                          const currentObject = subCategoryData?.data.find(
                            (item) => item.id === field.value,
                          );
                          return (
                            <div>
                              <SelectedInput
                                data={subCategoryData?.data}
                                selected={currentObject}
                                onSelected={(item) => field.onChange(item.id)}
                                renderLabel={(item) => item.title}
                                getUniqueKey={(item) => item.title}
                                label="หมวดหมู่ย่อย"
                                placeholder="เลือกหมวดหมู่ย่อย"
                                require
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
                    <InputForm
                      type="textArea"
                      control={form.control}
                      label="คำอธิบายเพิ่มเติม"
                      name="description"
                      required
                      className="col-span-2"
                      placeholder="ระบุรายละเอียดสเปค..."
                    />

                    {equipment && (
                      <Controller
                        name="status"
                        control={form.control}
                        rules={{ required: "เลือก" }}
                        render={({ field, fieldState }) => {
                          return (
                            <div className="space-y-3">
                              <Label>สถานะอุปกรณ์</Label>
                              <Tabs
                                value={field.value}
                                onValueChange={(value) => field.onChange(value)}
                                className="w-[400px]"
                              >
                                <TabsList>
                                  <TabsTrigger value="active">
                                    เปิดใช้งาน
                                  </TabsTrigger>
                                  <TabsTrigger value="inactive">
                                    ปิดใช้งาน
                                  </TabsTrigger>
                                </TabsList>
                              </Tabs>

                              {fieldState.error && (
                                <span className="ml-1 text-[11px] font-medium text-red-500">
                                  *{fieldState.error.message}
                                </span>
                              )}
                            </div>
                          );
                        }}
                      />
                    )}
                    <Separator className="col-span-2" />
                    <Button
                      onClick={handleNext}
                      type="button"
                      className="col-span-2 w-full"
                    >
                      ต่อไป
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent
                  value="จำนวนอุปกรณ์"
                  className="flex w-full flex-col gap-5"
                >
                  <div className="flex flex-col justify-between">
                    <div className="space-y-5">
                      <input
                        hidden
                        accept="image/*"
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                      />
                      <InputForm
                        inputTypeValue="number"
                        label="สต๊อกทั้งหมด"
                        control={form.control}
                        name="totalStock"
                        required
                      />
                      <Separator />
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          className="w-1/3"
                          onClick={() => setIsActiveTab("รายละเอียด")}
                        >
                          ย้อนกลับ
                        </Button>
                        <SubmitBtn
                          pending={isPending}
                          title="บันทึก"
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </form>
            </Form>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpsetEquipmentModal;
