import { ActiveStatus } from "./status";

export type Equipment = {
  id: string;
  mainImage: string;
  title: string;
  description: string | null;
  totalStock: number;
  borrowedQty: number;
  reservedQty: number;
  status: ActiveStatus;
  updatedAt: string;
  subCategory: {
    id: string;
    title: string;
  };
  mainCategory: {
    id: string;
    title: string;
  };
};

export interface EquipmentResponse {
  data: Equipment[];
  meta: {
    totalCount: number;
    page: number;
    totalPage: number;
  };
}

