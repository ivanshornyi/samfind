/*
  Warnings:

  - A unique constraint covering the columns `[licenseId]` on the table `user_license` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `licenseId` to the `user_license` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_license" ADD COLUMN     "licenseId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_license_licenseId_key" ON "user_license"("licenseId");
