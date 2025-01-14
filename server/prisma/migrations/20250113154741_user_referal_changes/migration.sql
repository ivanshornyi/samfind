/*
  Warnings:

  - You are about to drop the `user_referrals` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "user_referrals";

-- CreateTable
CREATE TABLE "user_referral" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "invitedUserIds" TEXT[],

    CONSTRAINT "user_referral_pkey" PRIMARY KEY ("id")
);
