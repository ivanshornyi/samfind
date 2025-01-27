/*
  Warnings:

  - A unique constraint covering the columns `[invitedReferralCode]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "invitedReferralCode" DOUBLE PRECISION;

-- CreateIndex
CREATE UNIQUE INDEX "user_invitedReferralCode_key" ON "user"("invitedReferralCode");
