import z, { string } from "zod";

const MIN_TITLE_LENGTH = 3;

const baseSchema = z.object({
  name: z.string().min(MIN_TITLE_LENGTH, {
    message: `ชื่อต้องมีความยาวอย่างน้อย ${MIN_TITLE_LENGTH} อักษร`,
  }),
  labCode: z.string().regex(/^CB[0-9]+$/, {
    message: "รูปแบบรหัสไม่ถูกต้อง ต้องขึ้นต้นด้วย CB และตามด้วยหมายเลขห้อง",
  }),
});

export const laboratorySchema = baseSchema.extend({
  imageKey: z.string(),
  status: z.enum(["active", "inactive"]).optional(),
  labId: z.string().optional(),
});

export const laboratoryFormSchema = baseSchema
  .extend({
    labId: z.string().optional(),
    imageFile: z.instanceof(File).optional(),
    imageKey: z.string().optional(),
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

export type LaboratoryFormValue = z.infer<typeof laboratoryFormSchema>;

export type LaboratoryValue = z.infer<typeof laboratorySchema>;
export type LaboratoryRequest = z.infer<typeof laboratorySchema>;
