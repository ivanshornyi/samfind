-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "BalanceType" ADD VALUE 'sale';
ALTER TYPE "BalanceType" ADD VALUE 'sweat';

-- AlterTable
ALTER TABLE "wallet" ADD COLUMN     "salesAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "sweatAmount" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "wallet_transaction" ADD COLUMN     "saleInfoId" TEXT;

-- CreateTable
CREATE TABLE "sale_info" (
    "id" TEXT NOT NULL,
    "saleUserId" TEXT NOT NULL,
    "invitedUserId" TEXT NOT NULL,
    "earnedAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sale_info_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sale_info_saleUserId_key" ON "sale_info"("saleUserId");

-- CreateIndex
CREATE UNIQUE INDEX "sale_info_invitedUserId_key" ON "sale_info"("invitedUserId");

-- AddForeignKey
ALTER TABLE "sale_info" ADD CONSTRAINT "sale_info_saleUserId_fkey" FOREIGN KEY ("saleUserId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sale_info" ADD CONSTRAINT "sale_info_invitedUserId_fkey" FOREIGN KEY ("invitedUserId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet_transaction" ADD CONSTRAINT "wallet_transaction_saleInfoId_fkey" FOREIGN KEY ("saleInfoId") REFERENCES "sale_info"("id") ON DELETE SET NULL ON UPDATE CASCADE;
