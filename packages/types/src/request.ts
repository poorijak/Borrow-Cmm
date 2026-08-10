import { Course } from "./course";
import { User } from "./user";
import { EquipmentStatus, LabStatus, RequestStatus } from "./checkout";
import { Equipment } from "./equipment";
import { Laboratory } from "./laboratory";
import { LaboratorySortType } from "./params";

export interface BorrowRequestTableItem {
  id: string;
  status: EquipmentStatus | LabStatus;
  requestType: string;
  borrower: string;
  createdAt: string;
  subject: {
    subjectId: string;
    sujectCode: string;
  };
  teacher: {
    teacherId: string;
    teacherName: string;
  };
  purpose: string;
}

export interface BorrowRequestResponse {
  data: BorrowRequestTableItem[];
  meta: {
    totalCount: number;
    page: number;
    totalPage: number;
  };
}

export type RequestQueryType = "equipment" | "lab";

export interface EquipmentRequestItemDetail {
  id: string;
  detailId: string;
  equipmentId: string;
  quantity: number;
  equipment: Equipment;
}

export interface LabBookingWithLab {
  id: string;
  laboratoryId: string;
  detailId: string;
  bookingDate: string;
  slot: LaboratorySortType;
  status: LabStatus;
  laboratory: Laboratory;
}

export interface EquipmentDetailWithRelations {
  id: string;
  requestId: string;
  status: EquipmentStatus;
  subjectId: string;
  teacherId: string;
  purpose: string;
  additionalItems: string | null;
  borrowDate: string;
  returnDate: string;
  actualReturnDate: string | null;
  remark: string | null;
  equipmentRequestItems: EquipmentRequestItemDetail[];
  course?: Course;
  teacher?: User;
}

export interface LabBookingDetailWithRelations {
  id: string;
  requestId: string;
  status: LabStatus;
  subjectId: string;
  teacherId: string;
  usageDetails: string;
  memberNames: string;
  remark: string | null;
  labBookings: LabBookingWithLab[];
  course?: Course;
  teacher?: User;
}

export interface BorrowRequestDetail {
  id: string;
  userId: string;
  fullName: string;
  studentId: string;
  phone: string;
  email: string;
  educationLevel: string;
  idCardImage: string;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
  equipmentDetail: EquipmentDetailWithRelations | null;
  labBookingDetails: LabBookingDetailWithRelations | null;
}
