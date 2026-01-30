import InputForm from "@/components/shared/form-input";
import Modal from "@/components/shared/modal";
import SubmitBtn from "@/components/shared/submit-btn";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { courseFormSchema, CourseFormValue } from "@repo/schemas";
import { Save } from "lucide-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutateCourse } from "../hooks/useCourse";
import { Course } from "@repo/types";

interface UpsertCourseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: Course;
}

const UpsertCourseModal = ({
  onOpenChange,
  open,
  data,
}: UpsertCourseModalProps) => {
  const { mutate, isPending } = useMutateCourse();

  const form = useForm<CourseFormValue>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: data
      ? {
          label: data.label,
          code: data.code,
          courseId: data.id,
        }
      : {
          label: "",
          code: "",
          courseId: "",
        },
    mode: "onSubmit",
  });

  useEffect(() => {
    if (data) {
      form.reset({
        label: data.label,
        code: data.code,
        courseId: data.id,
      });
    } else {
      form.reset({
        label: "",
        code: "",
        courseId: "",
      });
    }
  }, [data, form]);

  const handleSubmit = (body: CourseFormValue) => {
    mutate(
      {
        label: body.label,
        code: body.code,
        courseId: data?.id,
      },
      {
        onSuccess: () => {
          form.reset({
            label: "",
            code: "",
            courseId: "",
          });
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Modal
      onOpenChange={onOpenChange}
      open={open}
      title={data ? `แก้ไขวิชา ${data.label}` : "เพิ่มรายวิชา"}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
          <InputForm
            control={form.control}
            name="label"
            label="กรุณากรอกขื่อวิชา"
            placeholder="เช่น Introduction to Programming"
            required
          />
          <InputForm
            control={form.control}
            name="code"
            label="กรุณากรอกรหัสวิชา"
            placeholder="กรอกรหัส เช่น CMM123"
            required
          />
          <SubmitBtn disabled={isPending} className="w-full" title="บันทึก" icon={Save} />
        </form>
      </Form>
    </Modal>
  );
};

export default UpsertCourseModal;
