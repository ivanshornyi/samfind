/*
  Warnings:

  - You are about to drop the column `deviceId` on the `active_license` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "active_license" DROP COLUMN "deviceId",
ADD COLUMN     "desktopId" TEXT,
ADD COLUMN     "mobileId" TEXT;
