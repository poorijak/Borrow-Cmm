import InputForm from "@/components/shared/form-input";
import Modal from "@/components/shared/modal";
import { Form } from "@/components/ui/form";
import { Save, Trash2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SubmitBtn from "@/components/shared/submit-btn";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { useMutationCategory } from "../hooks/useCategory";
import { categoryFormSchema, CategoryFormValue } from "@repo/schemas";
import { Categories } from "@repo/types";
import { getPublicUrl } from "@/lib/utils";

type UpsertCategoryProsp = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: Categories;
};

const UpsertCategory = ({
  open,
  onOpenChange,
  data: category,
}: UpsertCategoryProsp) => {
  const { mutate, isPending } = useMutationCategory();

  const [existingRemove, setExistingRemove] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const form = useForm<CategoryFormValue>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: category
      ? {
          title: category.title,
          imageKey: category.mainImage,
        }
      : {
          title: "",
          imageFile: undefined,
        },
    mode: "onSubmit",
  });

  useEffect(() => {
    setExistingRemove(false);

    if (category) {
      form.reset({
        title: category.title ?? "",
        imageKey: category.mainImage ?? "",
        imageFile: undefined,
      });
    } else {
      form.reset({
        title: "",
        imageFile: undefined,
        imageKey: "",
      });
    }

    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [category, form]);

  const imageSrc: string | undefined = preview
    ? preview
    : !existingRemove && category?.mainImage
      ? getPublicUrl(category.mainImage)
      : undefined;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    form.setValue("imageFile", file, { shouldValidate: true });

    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const handleSubmit = (data: CategoryFormValue) => {
    mutate(
      {
        title: data.title,
        imageFile: data.imageFile,
        imageKey: data.imageKey,
        categoryId: category?.id,
      },
      {
        onSuccess: () => {
          handleRemoveImage();
          form.reset({
            title: "",
            imageFile: undefined,
          });
          onOpenChange(false);
        },
      }
    );
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // note

  const handleRemoveImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
      form.setValue("imageFile", undefined as any, { shouldValidate: true });
      return;
    }

    setExistingRemove(true);
    form.setValue("imageKey", undefined as any, { shouldDirty: true });
  };

  return (
    <Modal title="เพิ่มหมวดหมู่อุปกรณ์" open={open} onOpenChange={onOpenChange}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit, (e) => {
            console.log(e);
          })}
          onChange={() => form.clearErrors()}
          className="flex flex-col gap-5"
        >
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          {imageSrc ? (
            <div className="relative  w-full h-48 border rounded-lg overflow-hidden cursor-pointer">
              <Image
                alt="Preview-category"
                src={imageSrc}
                fill
                unoptimized
                className="object-contain"
              />
              <div
                className="absolute top-4 right-4 text-destructive"
                onClick={handleRemoveImage}
              >
                <Trash2 size={20} />
              </div>
            </div>
          ) : (
            <div
              className="border border-dashed hover:cursor-pointer flex justify-center items-center py-8"
              onClick={triggerFileInput}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="rounded-full  flex items-center justify-center ">
                  <Icon className="size-20" icon="fluent-color:image-48" />
                </div>
                <div className="text-center gap-1 text-xs flex flex-col">
                  <p className=" text-blue-800">
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
          <InputForm
            control={form.control}
            label="ตั้งขื่อหมวดหมู่"
            placeholder="กรอกชื่อหมวดหมู่อุปกรณ์ เช่น เครื่องมือช่าง"
            name="title"
            required
          />
          <SubmitBtn pending={isPending} title="บันทึก" icon={Save} />
        </form>
      </Form>
    </Modal>
  );
};

export default UpsertCategory;
