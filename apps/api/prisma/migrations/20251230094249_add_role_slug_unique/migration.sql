/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Role` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Role_slug_key" ON "Role"("slug");
