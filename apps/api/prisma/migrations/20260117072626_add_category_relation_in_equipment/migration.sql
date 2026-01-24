/*
  Warnings:

  - Added the required column `subCategoryId` to the `Equipment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Equipment" ADD COLUMN     "subCategoryId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Equipment" ADD CONSTRAINT "Equipment_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "EquipmentSubCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
