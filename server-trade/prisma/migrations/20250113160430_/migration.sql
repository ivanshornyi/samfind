/*
  Warnings:

  - A unique constraint covering the columns `[referralCode]` on the table `user_referral` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `referralCode` to the `user_referral` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `user_referral` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_referral" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "referralCode" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_referral_referralCode_key" ON "user_referral"("referralCode");
