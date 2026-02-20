import { LabStatus, RequestStatus } from "./checkout";
import { EquipmentItem } from "./equipment";
import { Laboratory } from "./laboratory";
import { LaboratorySortType } from "./params";

export const EqStatus = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  PICKED_UP: "picked_up",
  RETURNED: "returned",
} as const;

export type EquipmentStatus = (typeof EqStatus)[keyof typeof EqStatus];

export interface FindRequestApprovalResponse {
  request: BorrowRequestApproval;
  equipmentDetail: EquipmentDetailApproval | null;
  labDetail: LabDetailApproval | null;
}

// ข้อมูลพื้นฐานของผู้ยืม
export interface BorrowRequestApproval {
  id: string;
  userId: string;
  fullName: string;
  studentId: string;
  phone: string;
  email: string;
  educationLevel: string;
  idCardImage: string;
  status: RequestStatus;
}

// รายละเอียดอุปกรณ์
export interface EquipmentDetailApproval {
  id: string;
  subjectId: string;
  teacherId: string;
  additionalItems: string;
  borrowDate: string;
  returnDate: string;
  status: EquipmentStatus;
  equipmentRequestItems: EquipmentRequestItemApproval[];
}

export interface EquipmentRequestItemApproval {
  quantity: number;
  equipment: EquipmentItem;
}

// รายละเอียดห้องแล็บ
export interface LabDetailApproval {
  id: string;
  subjectId: string;
  teacherId: string;
  usageDetails: string;
  memberNames: string;
  status: LabStatus;
  labBookings: LabBookingApproval[];
}

export interface LabBookingApproval {
  id: string;
  bookingDate: string;
  slot: LaboratorySortType;
  status: string;
  laboratoryId: string;
  laboratory: Laboratory;
}
