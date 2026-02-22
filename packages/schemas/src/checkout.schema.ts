import * as z from "zod";

const baseSchema = z.object({
  fullName: z.string().min(1, "กรุณากรอกชื่อ-นามสกุล"),
  studentId: z.string().min(1, "กรุณากรอกรหัสนักศึกษา"),
  phone: z.string().min(10, "เบอร์โทรศัพท์ต้องมี 10 หลัก"),
  email: z.string().email("รูปแบบ Email ไม่ถูกต้อง"),
  educationLevel: z.string().min(1, "กรุณาเลือกระดับการศึกษา"),
});

const step1UserSchema = baseSchema.extend({
  idCardImageFile: z.instanceof(File),
});

const step1UserSchemaRequest = baseSchema.extend({
  idCardImageKey: z.string(),
});

const step2EquipmentSchema = z.object({
  subjectId: z.string().min(1, "กรุณาเลือกวิชา"),
  teacherId: z.string().min(1, "กรุณาเลือกอาจารย์"),
  purpose: z.string().min(5, "กรุณาระบุวัตถุประสงค์"),
  additionalItems: z.string().optional(),
  borrowRange: z.object(
    {
      from: z.coerce.date(),
      to: z.coerce.date(),
    },
    { required_error: "กรุณาเลือกวันที่ยืม-คืน" },
  ),
});

const step3LabSchema = z.object({
  subjectId: z.string().min(1, "กรุณาเลือกวิชา"),
  teacherId: z.string().min(1, "กรุณาเลือกอาจารย์"),
  usageDetails: z.string().min(5, "กรุณาระบุรายละเอียดการใช้ห้อง"),
  memberNames: z.string().min(1, "กรุณาระบุรายชื่อนักศึกษาที่เข้าใช้ห้อง"),
});

export const borrowFormSchema = z.object({
  step1: step1UserSchema,
  equipment: step2EquipmentSchema.optional(),
  lab: step3LabSchema.optional(),
});

export const borrowSchema = z.object({
  step1: step1UserSchemaRequest,
  equipment: step2EquipmentSchema.optional(),
  lab: step3LabSchema.optional(),
});

export type BorrowFormValues = z.infer<typeof borrowFormSchema>;

export type BorrowValues = z.infer<typeof borrowSchema>;
 