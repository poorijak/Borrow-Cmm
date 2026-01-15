/*
  Warnings:

  - The values [Active,Inactive] on the enum `ActiveStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [Administrater,Moderater,Student,Instructor] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ActiveStatus_new" AS ENUM ('active', 'inactive');
ALTER TABLE "EquipmentCategory" ALTER COLUMN "status" TYPE "ActiveStatus_new" USING ("status"::text::"ActiveStatus_new");
ALTER TABLE "EquipmentSubCategory" ALTER COLUMN "status" TYPE "ActiveStatus_new" USING ("status"::text::"ActiveStatus_new");
ALTER TYPE "ActiveStatus" RENAME TO "ActiveStatus_old";
ALTER TYPE "ActiveStatus_new" RENAME TO "ActiveStatus";
DROP TYPE "public"."ActiveStatus_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('administrater', 'moderater', 'student', 'instructor');
ALTER TABLE "public"."User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "public"."UserRole_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'student';
COMMIT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'student';
