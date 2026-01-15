export const ROLES = {
  ADMIN: "administrater", 
  MODERATOR: "moderater", 
  STUDENT: "student",
  INSTRUCTOR: "instructor",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export type User = {
  id: string;
  name: string;
  email: string;
  profileImage: string | undefined | Blob;
  createdAt: string | Date;
  updatedAt: string | Date;
  role: Role;
};
