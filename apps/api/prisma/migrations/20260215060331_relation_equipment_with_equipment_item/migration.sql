-- DropForeignKey
ALTER TABLE "LabBooking" DROP CONSTRAINT "LabBooking_detailId_fkey";

-- AddForeignKey
ALTER TABLE "LabBooking" ADD CONSTRAINT "LabBooking_detailId_fkey" FOREIGN KEY ("detailId") REFERENCES "LabBookingDetail"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquipmentRequestItem" ADD CONSTRAINT "EquipmentRequestItem_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
