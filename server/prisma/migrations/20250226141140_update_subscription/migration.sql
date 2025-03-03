/*
  Warnings:

  - Added the required column `stripeSubscriptionId` to the `subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "subscription" ADD COLUMN     "stripeSubscriptionId" TEXT NOT NULL;
