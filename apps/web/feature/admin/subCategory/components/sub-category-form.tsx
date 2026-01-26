"use client";

import InputForm from "@/components/shared/form-input";
import SubmitBtn from "@/components/shared/submit-btn";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { subCategoryFormSchema, subCategoryValue } from "@repo/schemas";
import { Save } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { useSubCategory } from "../hooks/useSubCate";

interface SubCategoryFormProps {
  id: string;
}

const SubCategoryForm = ({ id }: SubCategoryFormProps) => {
  const { mutate, isPending } = useSubCategory();

  const form = useForm<subCategoryValue>({
    resolver: zodResolver(subCategoryFormSchema),
    defaultValues: {
      title: "",
    },
    mode: "onSubmit",
  });

  const handleSubmit = (data: subCategoryValue) => {
    mutate(
      {
        data: { title: data.title },
        mainCateId: id,
      },
      {
        onSuccess: () => {
          form.reset({
            title: "",
          });
        },
      }
    );
  };
  return (
    <div>
      <header className="mb-5">
        <h3 className="text-2xl font-bold">หมวดหมู่ย่อย</h3>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>เพิ่มหมวดหมู่ย่อย</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-5"
            >
              <InputForm
                control={form.control}
                name="title"
                placeholder="เช่น DSLR, Action Camera, Mirrorless"
              />
              <SubmitBtn
                pending={isPending}
                title="บันทึก"
                className="w-full"
                icon={Save}
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubCategoryForm;
