import { ActiveStatus } from "./status";

export type Equipment = {
  id: string;
  mainImage: string;
  title: string;
  description?: string;
  totalStock: number;
  borrowedQty: number;
  reservedQty: number;
  status: ActiveStatus;
  createdAt: string;
  updatedAt: string;
  subCategoryId: string;
  mainCateogoryId: string;
};
