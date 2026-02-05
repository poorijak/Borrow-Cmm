/*
  Warnings:

  - A unique constraint covering the columns `[labCode]` on the table `Laboratory` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Laboratory_labCode_key" ON "Laboratory"("labCode");
