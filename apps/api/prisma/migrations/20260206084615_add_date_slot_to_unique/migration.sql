/*
  Warnings:

  - A unique constraint covering the columns `[labId,bagId,date,slot]` on the table `BagLabItem` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "BagLabItem_labId_bagId_key";

-- CreateIndex
CREATE UNIQUE INDEX "BagLabItem_labId_bagId_date_slot_key" ON "BagLabItem"("labId", "bagId", "date", "slot");
