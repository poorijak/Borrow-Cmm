import { Equipment, EquipmentItem } from "./equipment";
import { Laboratory } from "./laboratory";
import { LaboratorySortType } from "./params";

// จัดกลุ่ม Enum ให้ตรงกับ Schema จริง (แก้จาก userd เป็น used)
export const LabStatus = {
  PENDING_TEACHER: "pending_teacher",
  PENDING_STAFF: "pending_staff",
  APPROVED: "approved",
  REJECTED: "rejected",
  USED: "used", //
  NO_SHOW: "no_show",
  EXPIRED: "expired",
} as const;

export const ReqStatus = {
  PENDING: "pending",
  PROCESSING: "processing",
  APPROVED: "approved",
  REJECTED: "rejected",
  PARTIALLY_APPROVED: "partially_approved",
  COMPLETED: "completed",
  CANCELED: "canceled",
} as const;

export type RequestStatus = (typeof ReqStatus)[keyof typeof ReqStatus];
export type LabStatus = (typeof LabStatus)[keyof typeof LabStatus];

export interface borrowRequest {
  id: string;
  userId: string;
  fullName: string;
  studentId: string;
  phone: string;
  email: string;
  educationLevel: string;
  idCardImage: string;
  status: RequestStatus;
  equipmentDetail: equipmentItemDetail | null;
  labBookingDetails: LabBookingDetail | null;
}

export interface equipmentItemDetail {
  id: string;
  status: string;
  subjectId: string;
  teacherId: string;
  purpose: string;
  additionalItems: string | null;
  borrowDate: string | Date;
  returnDate: string | Date;
  actualReturnDate?: string | Date | null;
  approvedById?: string | null;
  approvedAt?: string | Date | null;
  rejectedById?: string | null;
  rejectedAt?: string | Date | null;
  remark?: string | null;
  equipmentRequestItems: EquipmentRequestItem[];
}

export interface EquipmentRequestItem {
  id: string;
  quantity: number;
  equipmentId: string; // เพิ่มฟิลด์ ID
  equipment: EquipmentItem; // ข้อมูลอุปกรณ์สำหรับแสดงผลใน PDF
}

export interface LabBookingDetail {
  id: string;
  status: LabStatus;
  subjectId: string; // ใช้ s ตัวเล็ก
  teacherId: string;
  usageDetails: string;
  memberNames: string;
  labBookings: LabBooking[]; // ต้องเป็น Array ตาม Schema (1:N)
}

export interface LabBooking {
  id: string;
  laboratoryId: string;
  detailId: string;
  bookingDate: string | Date;
  slot: LaboratorySortType; // 'morning' | 'afternoon'
  status: LabStatus;
  reservedAt: string | Date;
  expiresAt: string | Date;

  // รองรับ null จากการ Query
  teacherId: string | null;
  teacherApprovedAt: string | Date | null;
  teacherRejectedAt: string | Date | null;

  staffId: string | null;
  staffApprovedAt: string | Date | null;
  staffRejectedAt: string | Date | null;

  laboratory?: Laboratory; // สำหรับดึงชื่อห้องแล็บ
}
