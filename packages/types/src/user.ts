export const ROLES = {
  ADMIN: "Administrater", 
  MODERATOR: "Moderater", 
  STUDENT: "Student",
  INSTRUCTOR: "Instructor",
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
