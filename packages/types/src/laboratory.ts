import { ActiveStatus } from "./status";

export type baseType = {
  id: string;
  name: string;
  labCode: string;
  image: string;
  status: ActiveStatus;
};

export interface Laboratory extends baseType {
  isAvailable?: boolean;
}

export interface LaboratoryAdmin extends baseType {
  updatedAt: string;
  totalBorrowed: number;
}

export interface LaboratoryResponse {
  data: LaboratoryAdmin[];
  meta: {
    totalCount: number;
    page: number;
    totalPage: number;
  };
}
