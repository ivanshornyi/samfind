/*
  Warnings:

  - You are about to drop the `user_license` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "LicenseStatus" AS ENUM ('active', 'inactive');

-- DropForeignKey
ALTER TABLE "user_license" DROP CONSTRAINT "user_license_userId_fkey";

-- DropTable
DROP TABLE "user_license";

-- DropEnum
DROP TYPE "LicenseOSType";

-- DropEnum
DROP TYPE "UserLicenseStatus";

-- CreateTable
CREATE TABLE "license" (
    "id" TEXT NOT NULL,
    "status" "LicenseStatus" NOT NULL DEFAULT 'active',
    "userId" TEXT NOT NULL,

    CONSTRAINT "license_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "license" ADD CONSTRAINT "license_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
