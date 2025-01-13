/*
  Warnings:

  - A unique constraint covering the columns `[referralCode]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `referralCode` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN "referralCode" TEXT NOT NULL DEFAULT 'DEFAULT_CODE';


-- CreateIndex
CREATE UNIQUE INDEX "user_referralCode_key" ON "user"("referralCode");
