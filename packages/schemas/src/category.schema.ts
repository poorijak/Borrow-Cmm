import { z } from "zod";

const MIN_TITLE_LENGTH = 3;

// Schema พื้นฐาน
const baseSchema = z.object({
  title: z.string().min(MIN_TITLE_LENGTH, { message: "ชื่อต้องมีความยาวอย่างน้อย 3 ตัวอักษร" }),
});

// สำหรับใช้ใน Controller (Backend รับ imageKey เป็น string)
export const categorySchema = baseSchema.extend({
  imageKey: z.string().min(1, { message: "ไม่พบข้อมูลรูปภาพ" }),
});

// สำหรับใช้ใน React Hook Form (Frontend รับ imageFile เป็น File object)
export const categoryFormSchema = baseSchema.extend({
  imageFile: z.instanceof(File, { message: "กรุณาเลือกรูปภาพ" }),
});


// Value ของ RHF
export type CategoryFormValue = z.infer<typeof categoryFormSchema>;
export type CategoryRequest = z.infer<typeof categorySchema>;
export type CategoryValue = z.infer<typeof categorySchema>;