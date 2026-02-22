/*
  Warnings:

  - You are about to drop the column `approvedAt` on the `LabBooking` table. All the data in the column will be lost.
  - You are about to drop the column `approvedById` on the `LabBooking` table. All the data in the column will be lost.
  - You are about to drop the column `approvedByRole` on the `LabBooking` table. All the data in the column will be lost.
  - You are about to drop the column `rejectedAt` on the `LabBooking` table. All the data in the column will be lost.
  - You are about to drop the column `rejectedById` on the `LabBooking` table. All the data in the column will be lost.
  - You are about to drop the column `rejectedByRole` on the `LabBooking` table. All the data in the column will be lost.
  - The `status` column on the `LabBooking` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `detailId` to the `LabBooking` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('pending', 'processing', 'approved', 'rejected', 'partially_approved', 'completed', 'canceled');

-- CreateEnum
CREATE TYPE "LabStatus" AS ENUM ('pending_teacher', 'pending_staff', 'approved', 'rejected', 'used', 'no_show');

-- CreateEnum
CREATE TYPE "EquipmentStatus" AS ENUM ('pending', 'approved', 'rejected', 'picked_up', 'returned');

-- AlterTable
ALTER TABLE "LabBooking" DROP COLUMN "approvedAt",
DROP COLUMN "approvedById",
DROP COLUMN "approvedByRole",
DROP COLUMN "rejectedAt",
DROP COLUMN "rejectedById",
DROP COLUMN "rejectedByRole",
ADD COLUMN     "detailId" TEXT NOT NULL,
ADD COLUMN     "staffApprovedAt" TIMESTAMP(3),
ADD COLUMN     "staffId" TEXT,
ADD COLUMN     "staffRejectedAt" TIMESTAMP(3),
ADD COLUMN     "teacherApprovedAt" TIMESTAMP(3),
ADD COLUMN     "teacherId" TEXT,
ADD COLUMN     "teacherRejectedAt" TIMESTAMP(3),
DROP COLUMN "status",
ADD COLUMN     "status" "LabStatus" NOT NULL DEFAULT 'pending_teacher';

-- DropEnum
DROP TYPE "BookingStatus";

-- CreateTable
CREATE TABLE "BorrowRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "educationLevel" TEXT NOT NULL,
    "idCardImage" TEXT NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BorrowRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EquipmentDetail" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "status" "EquipmentStatus" NOT NULL DEFAULT 'pending',
    "subjectId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "additionalItems" TEXT,
    "borrowDate" TIMESTAMP(3) NOT NULL,
    "returnDate" TIMESTAMP(3) NOT NULL,
    "actualReturnDate" TIMESTAMP(3),
    "approvedById" TEXT,
    "approvedAt" TIMESTAMP(3),
    "rejectedById" TEXT,
    "rejectedAt" TIMESTAMP(3),
    "remark" TEXT,

    CONSTRAINT "EquipmentDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LabBookingDetail" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "status" "LabStatus" NOT NULL DEFAULT 'pending_teacher',
    "subjectId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "usageDetails" TEXT NOT NULL,
    "memberNames" TEXT NOT NULL,

    CONSTRAINT "LabBookingDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EquipmentRequestItem" (
    "id" TEXT NOT NULL,
    "detailId" TEXT NOT NULL,
    "equipmentId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "EquipmentRequestItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EquipmentDetail_requestId_key" ON "EquipmentDetail"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "LabBookingDetail_requestId_key" ON "LabBookingDetail"("requestId");

-- AddForeignKey
ALTER TABLE "LabBooking" ADD CONSTRAINT "LabBooking_detailId_fkey" FOREIGN KEY ("detailId") REFERENCES "LabBookingDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquipmentDetail" ADD CONSTRAINT "EquipmentDetail_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "BorrowRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabBookingDetail" ADD CONSTRAINT "LabBookingDetail_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "BorrowRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquipmentRequestItem" ADD CONSTRAINT "EquipmentRequestItem_detailId_fkey" FOREIGN KEY ("detailId") REFERENCES "EquipmentDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
