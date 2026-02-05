import z, { string } from "zod";

const MIN_TITLE_LENGTH = 3;
const MIN_DESCRIPTION_LENGTH = 3;

const baseSchema = z.object({
  title: z.string().min(MIN_TITLE_LENGTH, {
    message: `ชื่อต้องมีความยาวอย่างน้อย ${MIN_TITLE_LENGTH} อักษร`,
  }),
  description: z
    .string({ message: "กรุณากรอกคำอธิบายเพิ่มเติมของอุปกรณ์" })
    .min(MIN_DESCRIPTION_LENGTH, {
      message: `คำอธิบายต้องมีความยาวอย่างน้อย ${MIN_DESCRIPTION_LENGTH} อักษร`,
    }),
  subCategoryId: z.string().min(1, { message: "กรุณาเลือกหมวดหมู่ย่อย" }),
  totalStock: z.coerce.number({ message: "สต๊อกทั้งหมดต้องเป็นตัวเลข" }),
});

export const equipmentSchema = baseSchema.extend({
  imageKey: z.string(),
  mainCategoryId: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional(),
  eqiupmentId: z.string().optional(),
});

export const equipmentFormSchema = baseSchema
  .extend({
    eqiupmentId: z.string().optional(),
    imageFile: z.instanceof(File).optional(),
    imageKey: z.string().optional(),
    mainCategoryId: string().optional(),
    status: z.enum(["active", "inactive"]).optional(),
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

// front end form
export type EquipmentFormValue = z.infer<typeof equipmentFormSchema>;

// back end value / schema

export type EquipmentValue = z.infer<typeof equipmentSchema>;
export type EquipmentRequest = z.infer<typeof equipmentSchema>;
