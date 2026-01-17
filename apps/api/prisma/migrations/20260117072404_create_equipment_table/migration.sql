-- CreateTable
CREATE TABLE "Equipment" (
    "id" TEXT NOT NULL,
    "mainImage" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "totalStock" INTEGER NOT NULL,
    "borrowedQty" INTEGER NOT NULL,
    "reservedQty" INTEGER NOT NULL,
    "status" "ActiveStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Equipment_pkey" PRIMARY KEY ("id")
);
