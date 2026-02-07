// 1. กำหนด Enum สำหรับช่วงเวลา

import { LaboratorySortType } from "./params";

// 2. ข้อมูลอุปกรณ์ภายในรายการ
export interface EquipmentInBag {
  id: string;
  mainImage: string;
  title: string;
  totalStock: number;
  subCategoryId: string;
}

export interface LaboratoryInBag {
  id: string;
  name: string;
  labCode: string;
  image: string;
  status: boolean;
}

export interface BagEquipmentItem {
  id: string;
  itemCount: number;
  bagId: string;
  equipmentId: string;
  isSelected: boolean;
  equipment: EquipmentInBag;
}

export interface BagLabItem {
  id: string;
  bagId: string;
  labId: string;
  date: string;
  slot: LaboratorySortType;
  isSelected: boolean;
  laboratory: LaboratoryInBag;
}

// 6. ตัวแม่: ข้อมูลกระเป๋า (Root Object)
export interface BorrowBag {
  id: string;
  itemCount: number;
  totalQty: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  equipmentItems: BagEquipmentItem[];
  labItems: BagLabItem[];
}
