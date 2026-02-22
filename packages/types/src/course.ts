import { ActiveStatus } from "./status";

export interface Course {
  id: string;
  label: string;
  code: string;
  status: ActiveStatus;
  updatedAt: string;
}

export interface CourseList extends Course {
  displayName: string;
}

export interface CourseResponse {
  data: Course[];
  meta: {
    totalCount: number;
    page: number;
    totalPage: number;
  };
}
