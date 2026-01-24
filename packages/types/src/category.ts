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

export interface SubCategories {
  id: string;
  title: string;
  updatedAt: string;
  equipmentCout: number;
}

export interface SubCategoriesResponse {
  data: SubCategories[];
  meta: {
    page: number;
    totalCount: number;
    totalPages: number;
  };
}
