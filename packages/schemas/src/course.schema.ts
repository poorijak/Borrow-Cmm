import z, { string } from "zod";

export const baseSchema = z.object({
  label: z.string(),
  courseId: z.string().optional(),
});
export const courseFormSchema = baseSchema.extend({
  code: z.string().regex(/^CMM[0-9]+$/, {
    message: "รูปแบบรหัสไม่ถูกต้อง ต้องขึ้นต้นด้วย CMM และตามด้วยหมายเลขวิชา",
  }),
});

export const courseSchema = baseSchema.extend({
  code: string(),
});

export type CourseFormValue = z.infer<typeof courseFormSchema>;

export type CourseValue = z.infer<typeof courseSchema>;
export type CourseRequest = z.infer<typeof courseSchema>;
