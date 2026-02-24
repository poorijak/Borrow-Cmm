/*
  Warnings:

  - The values [expiresd] on the enum `LabStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "LabStatus_new" AS ENUM ('pending_teacher', 'pending_staff', 'approved', 'rejected', 'used', 'no_show', 'expired');
ALTER TABLE "public"."LabBooking" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."LabBookingDetail" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "LabBooking" ALTER COLUMN "status" TYPE "LabStatus_new" USING ("status"::text::"LabStatus_new");
ALTER TABLE "LabBookingDetail" ALTER COLUMN "status" TYPE "LabStatus_new" USING ("status"::text::"LabStatus_new");
ALTER TYPE "LabStatus" RENAME TO "LabStatus_old";
ALTER TYPE "LabStatus_new" RENAME TO "LabStatus";
DROP TYPE "public"."LabStatus_old";
ALTER TABLE "LabBooking" ALTER COLUMN "status" SET DEFAULT 'pending_teacher';
ALTER TABLE "LabBookingDetail" ALTER COLUMN "status" SET DEFAULT 'pending_teacher';
COMMIT;
