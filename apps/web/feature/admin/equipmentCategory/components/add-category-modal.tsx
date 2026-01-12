import InputForm from "@/components/shared/input-form";
import Modal from "@/components/shared/modal";
import { Form } from "@/components/ui/form";
import { Save, Trash2, X } from "lucide-react";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
// import { categorySchema, CategoryValue } from "@repo/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import SubmitBtn from "@/components/shared/submit-btn";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { useMutationCategory } from "../hooks/useCategory";
import { categoryFormSchema, CategoryFormValue } from "@repo/schemas";

type AddCategoryModal = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const AddCategoryModal = ({ open, onOpenChange }: AddCategoryModal) => {
  const { mutate, isPending } = useMutationCategory();
  const [perview, setPreview] = useState<string | null>(null);

  const form = useForm<CategoryFormValue>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      title: "",
      imageFile: undefined,
    },
    mode: "onSubmit",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    form.setValue("imageFile", file, { shouldValidate: true });

    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const handleSubmit = (data: CategoryFormValue) => {
    console.log(data);

    mutate(data, {
      onSuccess: () => {
        handleRemoveImage();
        form.reset({
          title: "",
          imageFile: undefined,
        });
        onOpenChange(false);
      },
    });
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    if (!perview) return;

    form.setValue("imageFile", undefined as any, { shouldValidate: true });

    URL.revokeObjectURL(perview);
    setPreview(null);
  };

  return (
    <Modal title="เพิ่มหมวดหมู่อุปกรณ์" open={open} onOpenChange={onOpenChange}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
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
          {perview ? (
            <div className="relative  w-full h-48 border rounded-lg overflow-hidden cursor-pointer">
              <Image
                alt="Preview-category"
                src={perview}
                fill
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

export default AddCategoryModal;
