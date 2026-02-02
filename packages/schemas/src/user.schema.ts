import z from "zod";

export const updateUserRole = z.object({
  role: z.enum(["administrater", "moderater", "student", "instructor"]),
});

export type UpdateUserRoleValue = z.infer<typeof updateUserRole>;
