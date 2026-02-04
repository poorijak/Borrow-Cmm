-- CreateEnum
CREATE TYPE "TimeSlot" AS ENUM ('morning', 'afternoon');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('pending', 'reject', 'appove', 'in_use', 'completed', 'cancelled', 'approveByTeacher', 'rejectByTeacher');

-- DropForeignKey
ALTER TABLE "Equipment" DROP CONSTRAINT "Equipment_subCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "EquipmentSubCategory" DROP CONSTRAINT "EquipmentSubCategory_mainCategoryId_fkey";

-- CreateTable
CREATE TABLE "LabBooking" (
    "id" TEXT NOT NULL,
    "laboratoryId" TEXT NOT NULL,
    "bookingDate" TIMESTAMP(3) NOT NULL,
    "slot" "TimeSlot" NOT NULL,
    "status" "BookingStatus" NOT NULL,
    "reservedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LabBooking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LabBooking_laboratoryId_slot_bookingDate_key" ON "LabBooking"("laboratoryId", "slot", "bookingDate");

-- AddForeignKey
ALTER TABLE "EquipmentSubCategory" ADD CONSTRAINT "EquipmentSubCategory_mainCategoryId_fkey" FOREIGN KEY ("mainCategoryId") REFERENCES "EquipmentCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Equipment" ADD CONSTRAINT "Equipment_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "EquipmentSubCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabBooking" ADD CONSTRAINT "LabBooking_laboratoryId_fkey" FOREIGN KEY ("laboratoryId") REFERENCES "Laboratory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
