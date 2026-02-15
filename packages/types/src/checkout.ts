export enum RequestEunm {
  PENDING = "pending",
  PROCESSING = "processing",
  APPROVED = "approved",
  REJECTED = "rejected",
  PARTIALLY_APPROVED = "partially_approved",
  COMPLETED = "completed",
  CANCELED = "canceled",
}
export enum LabEnum {
  PENDING_TEACHER = "pending_teacher",
  PENDING_STAFF = "pending_staff",
  APPROVED = "approved",
  REJECTED = "rejected",
  USED = "userd",
}
export enum equipmentEnum {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  PICKUP = "picked_up",
  RETURNED = "returned",
}
export const equipmentStatus = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  PICKUP: "picked_up",
  RETURNED: "returned",
} as const;

export const LabStatus = {
  PENDING_TEACHER: "pending_teacher",
  PENDING_STAFF: "pending_staff",
  APPROVED: "approved",
  REJECTED: "rejected",
  USED: "userd",
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
export type LabStatu = (typeof LabStatus)[keyof typeof LabStatus];
export type EquipmentStatus =
  (typeof equipmentStatus)[keyof typeof equipmentStatus];

export interface borrowRequest {
    id : string
  userId: string;
  fullName: string;
  studentId: string;
  phone: string;
  email: string;
  educationLevel: string;
  idCatdImage: string;
  status: RequestStatus;
}

export interface equipmentItemDetail {
    
}
