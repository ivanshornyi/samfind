/*
  Warnings:

  - The `referralCode` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropIndex
DROP INDEX "user_referralCode_key";

-- DropIndex
DROP INDEX "user_referral_userId_key";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "referralCode",
ADD COLUMN     "referralCode" DOUBLE PRECISION NOT NULL DEFAULT 0;
