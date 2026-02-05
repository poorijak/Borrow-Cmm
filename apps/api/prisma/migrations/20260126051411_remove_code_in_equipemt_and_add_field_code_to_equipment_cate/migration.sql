/*
  Warnings:

  - You are about to drop the column `code` on the `Equipment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `EquipmentCategory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `EquipmentCategory` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Equipment_code_key";

-- AlterTable
ALTER TABLE "Equipment" DROP COLUMN "code";

-- AlterTable
ALTER TABLE "EquipmentCategory" ADD COLUMN     "code" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "EquipmentCategory_code_key" ON "EquipmentCategory"("code");
