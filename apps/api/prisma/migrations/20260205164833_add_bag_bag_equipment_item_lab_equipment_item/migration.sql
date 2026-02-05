-- CreateTable
CREATE TABLE "BorrowBag" (
    "id" TEXT NOT NULL,
    "itemCount" INTEGER NOT NULL DEFAULT 0,
    "totalQty" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "BorrowBag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BagEquipmentItem" (
    "id" TEXT NOT NULL,
    "itemCount" INTEGER NOT NULL DEFAULT 1,
    "bagId" TEXT NOT NULL,
    "equipmentId" TEXT NOT NULL,
    "isSelected" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BagEquipmentItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BagLabItem" (
    "id" TEXT NOT NULL,
    "bagId" TEXT NOT NULL,
    "labId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "slot" "TimeSlot" NOT NULL,
    "isSelected" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BagLabItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BagEquipmentItem_bagId_equipmentId_key" ON "BagEquipmentItem"("bagId", "equipmentId");

-- CreateIndex
CREATE UNIQUE INDEX "BagLabItem_labId_bagId_key" ON "BagLabItem"("labId", "bagId");

-- AddForeignKey
ALTER TABLE "BorrowBag" ADD CONSTRAINT "BorrowBag_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BagEquipmentItem" ADD CONSTRAINT "BagEquipmentItem_bagId_fkey" FOREIGN KEY ("bagId") REFERENCES "BorrowBag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BagEquipmentItem" ADD CONSTRAINT "BagEquipmentItem_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BagLabItem" ADD CONSTRAINT "BagLabItem_bagId_fkey" FOREIGN KEY ("bagId") REFERENCES "BorrowBag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BagLabItem" ADD CONSTRAINT "BagLabItem_labId_fkey" FOREIGN KEY ("labId") REFERENCES "Laboratory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
