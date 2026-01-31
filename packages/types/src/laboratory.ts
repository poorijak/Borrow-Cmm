import { ActiveStatus } from "./status";

export type Laboratory = {
  id: string;
  name: string;
  labCode: string;
  updatedAt: string;
  image: string;
  status: ActiveStatus;
  totalBorrowed: number;
};

export interface LaboratoryResponse {
  data: Laboratory[];
  meta: {
    totalCout: number;
    page: number;
    totalPage: number;
  };
}
