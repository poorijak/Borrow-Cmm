import {
  CheckCircle2,
  Clock,
  XCircle,
  ShieldCheck,
  Timer,
  AlertCircle,
} from "lucide-react";

export const getStatusConfig = (status: string) => {
  switch (status) {
    // 🟡 รออนุมัติ / รอตรวจสอบ
    case "pending":
    case "pending_teacher":
    case "pending_staff":
    case "processing":
      return {
        label:
          status === "pending_teacher"
            ? "รออาจารย์อนุมัติ"
            : status === "pending_staff"
              ? "รอเจ้าหน้าที่อนุมัติ"
              : "รออนุมัติ",
        color: "bg-[#FFF4E3] text-[#FFA100] border-[#FFA100]/20",
        icon: <Clock size={14} className="text-[#FFA100]" />,
      };

    // 🟢 อนุมัติแล้ว
    case "approved":
      return {
        label: "อนุมัติ",
        color: "bg-[#DCFAE9] text-[#209A4A] border-[#209A4A]/20",
        icon: <CheckCircle2 size={14} className="text-[#209A4A]" />,
      };

    // 🔵 คืนของเรียบร้อย
    case "returned":
    case "completed":
      return {
        label: "คืนของเรียบร้อย",
        color: "bg-[#E8F2FC] text-[#055EBD] border-[#055EBD]/20",
        icon: <ShieldCheck size={14} className="text-[#055EBD]" />,
      };

    // 🟣 กำลังใช้ของ / รับของไปแล้ว
    case "picked_up":
    case "used":
      return {
        label: "กำลังใช้ของ",
        color: "bg-[#EEE6FF] text-[#5F16BC] border-[#5F16BC]/20",
        icon: <Timer size={14} className="text-[#5F16BC]" />,
      };

    // 🔴 ไม่อนุมัติ / ยกเลิก
    case "rejected":
    case "canceled":
    case "no_show":
      return {
        label: "ไม่อนุมัติ",
        color: "bg-[#FFE9E5] text-[#FF4E3E] border-[#FF4E3E]/20",
        icon: <XCircle size={14} className="text-[#FF4E3E]" />,
      };

    default:
      return {
        label: status,
        color: "bg-slate-50 text-slate-500 border-slate-200",
        icon: <AlertCircle size={14} />,
      };
  }
};
