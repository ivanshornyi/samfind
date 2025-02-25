/*
  Warnings:

  - Added the required column `status` to the `user_license` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserLicenseStatus" AS ENUM ('active', 'inactive');

-- AlterTable
ALTER TABLE "user_license" ADD COLUMN     "status" "UserLicenseStatus" NOT NULL;
