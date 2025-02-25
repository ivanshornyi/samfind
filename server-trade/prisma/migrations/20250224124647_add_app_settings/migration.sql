/*
  Warnings:

  - You are about to drop the `share_price` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "share_price";

-- CreateTable
CREATE TABLE "app_settings" (
    "id" TEXT NOT NULL,
    "sharePrice" DOUBLE PRECISION,
    "shareStripeProductId" TEXT,
    "shareStripePriceId" TEXT,
    "limitOfSharesPurchased" DOUBLE PRECISION DEFAULT 0,
    "currentSharesPurchased" DOUBLE PRECISION DEFAULT 0,
    "earlyBirdPeriod" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "app_settings_pkey" PRIMARY KEY ("id")
);
