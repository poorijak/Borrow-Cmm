import {
  Book,
  Box,
  Briefcase,
  Building,
  Clipboard,
  User2,
  UserMinus,
} from "lucide-react";

export const studentService = [
  {
    label: "บริการ",
    items: [
      {
        title: "ยืม/คืนอุปกรณ์",
        href: "/equipment",
        icon: Box,
      },
      {
        title: "จองห้องปฏิบัติการ",
        href: "/lab",
        icon: Building,
      },
    ],
  },
];

export const adminServices = [
  {
    label: "บริการ",
    items: [
      {
        title: "การยืม/คืน/จอง",
        href: "/admin/order",
        icon: Clipboard,
      },
      {
        title: "จัดการอุปกรณ์",
        href: "#",
        icon: Briefcase,
        subItems: [
          {
            title: "หมวดหมู่อุปกรณ์",
            href: "/admin/category",
            // subItems: [
            //   { title: "กล้อง", href: "/admin/equipmentCategory/camera" },
            //   { title: "เลนส์", href: "/admin/equipmentCategory/lens" },
            //   { title: "ไฟ", href: "/admin/equipmentCategory/light" },
            //   {
            //     title: "ไมโครโฟน",
            //     href: "/admin/equipmentCategory/microphone",
            //   },
            //   { title: "ขาตั้งกล้อง", href: "/admin/equipmentCategory/tripod" },
            //   { title: "ชุดพร้อมใช้", href: "/admin/equipmentCategory/sets" },
            //   { title: "อื่นๆ", href: "/admin/equipmentCategory/others" },
            // ],
          },
          {
            title: "อุปกรณ์",
            href: "/admin/equipment",
          },
        ],
      },
      {
        title: "จัดการรายวิชา",
        href: "/admin/course",
        icon: Book,
      },
      {
        title: "จัดการห้องปฏิบัติการ",
        href: "/admin/laboratory",
        icon: Building,
      },
    ],
  },
  {
    label: "การจัดการผู้ใช้งาน",
    items: [
      { title: "จัดการเจ้าหน้าที่", href: "/admin/staff", icon: User2 },
      { title: "จัดการผู้ใช้ทั่วไป", href: "/admin/user", icon: UserMinus },
    ],
  },
];
