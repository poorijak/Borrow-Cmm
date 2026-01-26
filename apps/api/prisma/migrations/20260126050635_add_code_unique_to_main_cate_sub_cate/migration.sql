/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Equipment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `EquipmentSubCategory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Equipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `EquipmentSubCategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Equipment" ADD COLUMN     "code" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "EquipmentSubCategory" ADD COLUMN     "code" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Equipment_code_key" ON "Equipment"("code");

-- CreateIndex
CREATE UNIQUE INDEX "EquipmentSubCategory_code_key" ON "EquipmentSubCategory"("code");
