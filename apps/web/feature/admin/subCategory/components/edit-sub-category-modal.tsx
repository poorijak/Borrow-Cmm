"use client";

import InputForm from "@/components/shared/input-form";
import Modal from "@/components/shared/modal";
import SubmitBtn from "@/components/shared/submit-btn";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { subCategoryFormSchema, subCategoryValue } from "@repo/schemas";
import { SubCategories } from "@repo/types";
import { Save } from "lucide-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSubCategory } from "../hooks/useSubCate";

interface EditSubCateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: SubCategories;
  mainCateId: string;
}

const EditSubCateModal = ({
  open,
  onOpenChange,
  data: subCategory,
  mainCateId,
}: EditSubCateModalProps) => {
  const { mutate, isPending } = useSubCategory();

  const form = useForm<subCategoryValue>({
    resolver: zodResolver(subCategoryFormSchema),
    defaultValues: {
      title: subCategory?.title ?? "",
    },
    mode: "onSubmit",
  });

  useEffect(() => {
    if (subCategory) {
      form.reset({
        title: subCategory.title ?? "",
      });
    } else {
      form.reset({
        title: "",
      });
    }
  }, [subCategory, form, mainCateId]);

  const handleSubmit = (data: subCategoryValue) => {
    mutate(
      {
        data: {
          title: data.title,
        },
        id: subCategory?.id,
        mainCateId,
      },
      {
        onSuccess: () => {
          form.reset({
            title: "",
          });
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="แก้ไขหมวดหมู่ย่อย">
      <Form {...form}>
        <form className="space-y-5" onSubmit={form.handleSubmit(handleSubmit)}>
          <InputForm
            control={form.control}
            name="title"
            label="กรุณากรอกชื่อหมวดหมู่ใหม่"
            placeholder="เช่น Action Camera"
            required
          />
          <SubmitBtn
            pending={isPending}
            title="บันทึก"
            icon={Save}
            className="w-full"
          />
        </form>
      </Form>
    </Modal>
  );
};

export default EditSubCateModal;
