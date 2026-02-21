import { EquipmentStatus, LabStatus, RequestStatus } from "@repo/types";

export const formatEqupmentStatus = (status: EquipmentStatus) => {
  switch (status) {
    case "approved":
      return "อนุมัติ";
    case "pending":
      return "รออนุมัติ";
    case "picked_up":
      return "รับไปแล้ว";
    case "returned":
      return "คืนแล้ว";
    case "rejected":
      return "ไม่อนุมัติ";
  }
};

export const formatLabStatus = (status: LabStatus) => {
  switch (status) {
    case LabStatus.PENDING_TEACHER:
      return "รออาจารย์อนุมัติ";
    case LabStatus.PENDING_STAFF:
      return "รอเจ้าหน้าที่ตรวจสอบ";
    case LabStatus.APPROVED:
      return "อนุมัติแล้ว";
    case LabStatus.REJECTED:
      return "ปฏิเสธการเข้าใช้";
    case LabStatus.USED:
      return "เข้าใช้บริการแล้ว";
    case LabStatus.NO_SHOW:
      return "ไม่ได้เข้าใช้ตามนัด";
    default:
      return "ไม่ทราบสถานะ";
  }
};

export const formatRequestStatus = (status: RequestStatus) => {
  switch (status) {
    case "pending":
      return "รอการดำเนินการ";
    case "processing":
      return "กำลังตรวจสอบ";
    case "approved":
      return "อนุมัติทั้งหมด";
    case "rejected":
      return "ปฏิเสธคำขอ";
    case "partially_approved":
      return "อนุมัติบางส่วน";
    case "completed":
      return "เสร็จสิ้น";
    case "canceled":
      return "ยกเลิกคำขอ";
    default:
      return "ไม่ทราบสถานะ";
  }
};

