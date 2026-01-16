import InputForm from "@/components/shared/input-form";
import Modal from "@/components/shared/modal";
import SubmitBtn from "@/components/shared/submit-btn";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { subCategoryFormSchema, subCategoryValue } from "@repo/schemas";
import { SubCategories } from "@repo/types";
import { Save } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";

interface EditSubCateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: SubCategories | undefined;
  mainCateId: string;
}

const EditSubCateModal = ({
  open,
  onOpenChange,
  data,
  mainCateId,
}: EditSubCateModalProps) => {
  const form = useForm<subCategoryValue>({
    resolver: zodResolver(subCategoryFormSchema),
    defaultValues: {
      title: "",
      mainCateId: mainCateId,
    },
    mode: "onSubmit",
  });

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="แก้ไขหมวดหมู่ย่อย">
      <Form {...form}>
        <form className="space-y-5">
          <InputForm
            control={form.control}
            name="title"
            label="กรุณากรอกชื่อหมวดหมู่ใหม่"
            placeholder="เช่น Action Camera"
            required
          />
          <SubmitBtn title="บันทึก" icon={Save} className="w-full" />
        </form>
      </Form>
    </Modal>
  );
};

export default EditSubCateModal;
