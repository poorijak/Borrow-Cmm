import { ActiveStatus } from "./status";

export type CreateCategoryFormInput = {
  file: File;
  title: string;
  type: "main" | "sub";
};

export type Categories = {
  id: string;
  title: string;
  status: ActiveStatus;
  updatedAt: string;
  mainImage: string;
  equipmentCount: number;
};

export interface CategoriesResponse {
  data: Categories[];
  meta: {
    page: number;
    total: number;
    totalPages: number;
  };
}
