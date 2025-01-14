/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `user_referral` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `referralCode` on the `user_referral` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "discountPercent" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "user_referral" ALTER COLUMN "invitedUserIds" SET DEFAULT ARRAY[]::TEXT[],
DROP COLUMN "referralCode",
ADD COLUMN     "referralCode" DOUBLE PRECISION NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_referral_userId_key" ON "user_referral"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_referral_referralCode_key" ON "user_referral"("referralCode");
