/*
  Warnings:

  - You are about to drop the column `desktopId` on the `active_license` table. All the data in the column will be lost.
  - You are about to drop the column `mobileId` on the `active_license` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "active_license" DROP COLUMN "desktopId",
DROP COLUMN "mobileId",
ADD COLUMN     "desktopIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "mobileIds" TEXT[] DEFAULT ARRAY[]::TEXT[];
