export const ROLES = {
  ADMIN: "administrater",
  MODERATOR: "moderater",
  STUDENT: "student",
  INSTRUCTOR: "instructor",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export interface BaseUser {
  id: string;
  name: string;
  email: string;
  profileImage: string;
  createdAt: string;
  role: Role;
}

export interface User extends BaseUser {
  overDueQTY: number;
  borrowedQTY: number;
}

export interface UserResponse {
  data: User[];
  meta: {
    totalCount: number;
    page: number;
    totalPage: number;
  };
}

export interface StaffResponse {
  data: Staff[];
  meta: {
    totalCount: number;
    page: number;
    totalPage: number;
  };
}

export interface Staff extends BaseUser {
  updatedAt?: string;
}
