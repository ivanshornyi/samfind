/*
  Warnings:

  - You are about to drop the column `endAmount` on the `discount` table. All the data in the column will be lost.
  - You are about to drop the column `startAmount` on the `discount` table. All the data in the column will be lost.
  - You are about to drop the column `purchased` on the `license` table. All the data in the column will be lost.
  - You are about to drop the column `discount` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `discount_income` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `amount` to the `discount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spentBonuses` to the `discount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spentDiscount` to the `discount` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BalanceType" AS ENUM ('discount', 'bonus', 'shares');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('income', 'expense');

-- DropForeignKey
ALTER TABLE "discount_income" DROP CONSTRAINT "discount_income_discountId_fkey";

-- DropForeignKey
ALTER TABLE "discount_income" DROP CONSTRAINT "discount_income_referralId_fkey";

-- DropForeignKey
ALTER TABLE "discount_income" DROP CONSTRAINT "discount_income_userId_fkey";

-- AlterTable
ALTER TABLE "active_license" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "discount" DROP COLUMN "endAmount",
DROP COLUMN "startAmount",
ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "spentBonuses" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "spentDiscount" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "license" DROP COLUMN "purchased";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "discount";

-- DropTable
DROP TABLE "discount_income";

-- CreateTable
CREATE TABLE "wallet" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "discountAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "bonusAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "sharesAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "selectedBonusToDiscount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallet_transaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "balanceType" "BalanceType" NOT NULL,
    "transactionType" "TransactionType" NOT NULL,
    "referralId" TEXT,
    "invitedUserId" TEXT,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wallet_transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "wallet_userId_key" ON "wallet"("userId");

-- AddForeignKey
ALTER TABLE "wallet" ADD CONSTRAINT "wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet_transaction" ADD CONSTRAINT "wallet_transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet_transaction" ADD CONSTRAINT "wallet_transaction_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet_transaction" ADD CONSTRAINT "wallet_transaction_referralId_fkey" FOREIGN KEY ("referralId") REFERENCES "user_referral"("id") ON DELETE SET NULL ON UPDATE CASCADE;
