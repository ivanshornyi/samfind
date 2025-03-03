-- AlterEnum
ALTER TYPE "PurchaseType" ADD VALUE 'earlyBird';

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "isFromNorway" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isSale" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isStaff" BOOLEAN NOT NULL DEFAULT false;
