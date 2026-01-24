/*
  Warnings:

  - The values [Inactvie] on the enum `ActiveStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ActiveStatus_new" AS ENUM ('Active', 'Inactive');
ALTER TABLE "EquipmentCategory" ALTER COLUMN "status" TYPE "ActiveStatus_new" USING ("status"::text::"ActiveStatus_new");
ALTER TABLE "EquipmentSubCategory" ALTER COLUMN "status" TYPE "ActiveStatus_new" USING ("status"::text::"ActiveStatus_new");
ALTER TYPE "ActiveStatus" RENAME TO "ActiveStatus_old";
ALTER TYPE "ActiveStatus_new" RENAME TO "ActiveStatus";
DROP TYPE "public"."ActiveStatus_old";
COMMIT;
