/*
  Warnings:

  - Added the required column `updatedAt` to the `plan` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ShareholderType" AS ENUM ('individual', 'company');

-- CreateEnum
CREATE TYPE "PurchaseType" AS ENUM ('bonus', 'money');

-- AlterTable
ALTER TABLE "plan" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "share_price" (
    "id" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "name" TEXT NOT NULL,
    "stripeProductId" TEXT,
    "stripePriceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "share_price_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_shareholders_data" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "shareholderType" "ShareholderType" NOT NULL,
    "name" TEXT NOT NULL,
    "identificationNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "postcode" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_shareholders_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchased_share" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "purchaseType" "PurchaseType" NOT NULL,
    "startNumber" DOUBLE PRECISION NOT NULL,
    "endNumber" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "purchased_share_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_shareholders_data_userId_key" ON "user_shareholders_data"("userId");

-- AddForeignKey
ALTER TABLE "user_shareholders_data" ADD CONSTRAINT "user_shareholders_data_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchased_share" ADD CONSTRAINT "purchased_share_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
