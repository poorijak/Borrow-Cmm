import { z } from "zod";

const MIN_TITLE_LENGTH = 3;

// Schema พื้นฐาน
const baseSchema = z.object({
  title: z.string().min(MIN_TITLE_LENGTH, {
    message: "ชื่อต้องมีความยาวอย่างน้อย 3 ตัวอักษร",
  }),
});

// สำหรับใช้ใน Controller (Backend รับ imageKey เป็น string)
export const categorySchema = baseSchema.extend({
  imageKey: z.string(),
});

// สำหรับใช้ใน React Hook Form (Frontend รับ imageFile เป็น File object)
export const categoryFormSchema = baseSchema
  .extend({
    imageFile: z.instanceof(File).optional(),
    imageKey: z.string().optional(),
    categoryId: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const imageFile = data.imageFile instanceof File;
    const imageKey =
      typeof data.imageKey === "string" && data.imageKey.trim().length > 0;

    if (!imageFile && !imageKey) {
      (ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["imageFile"],
        message: "กรุณาเลือกรูปภาพหรือใช้รูปเดิม",
      }),
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["imageKey"],
          message: "กรุณาเลือกรูปภาพหรือใช้รูปเดิม",
        }));
    }
  });

export const updateStatusCategorySchema = z.object({
  status: z.enum(["active", "inactive"]),
});

// Value ของ RHF
export type CategoryFormValue = z.infer<typeof categoryFormSchema>;
export type CategoryRequest = z.infer<typeof categorySchema>;
export type CategoryValue = z.infer<typeof categorySchema>;
export type UpdateStatusSchema = z.infer<typeof updateStatusCategorySchema>;
