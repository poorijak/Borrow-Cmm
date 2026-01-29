import { ActiveStatus } from "./status";

export interface Equipment extends EquipmentItem {
  updatedAt: string;
  subCategory: {
    id: string;
    title: string;
  };
  mainCategory: {
    id: string;
    title: string;
  };
}

export interface EquipmentResponse {
  data: Equipment[];
  meta: {
    totalCount: number;
    page: number;
    totalPage: number;
  };
}

export type EquipmentItem = {
  id: string;
  title: string;
  mainImage: string;
  description: string | null;
  totalStock: number;
  borrowedQty: number;
  reservedQty: number;
  status: ActiveStatus;
  subCategoryId?: string;
};
