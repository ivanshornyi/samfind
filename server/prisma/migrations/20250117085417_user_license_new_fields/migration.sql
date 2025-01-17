/*
  Warnings:

  - You are about to drop the column `key` on the `user_license` table. All the data in the column will be lost.
  - You are about to drop the column `licenseId` on the `user_license` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `user_license` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "LicenseOSType" AS ENUM ('windows', 'mac');

-- DropIndex
DROP INDEX "user_license_licenseId_key";

-- AlterTable
ALTER TABLE "user_license" DROP COLUMN "key",
DROP COLUMN "licenseId",
DROP COLUMN "name",
ADD COLUMN     "OSType" "LicenseOSType" NOT NULL DEFAULT 'windows';
