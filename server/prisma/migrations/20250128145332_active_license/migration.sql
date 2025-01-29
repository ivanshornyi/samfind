/*
  Warnings:

  - You are about to drop the column `userIds` on the `license` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "license" DROP COLUMN "userIds";

-- CreateTable
CREATE TABLE "active_license" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "licenseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "active_license_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "active_license" ADD CONSTRAINT "active_license_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "active_license" ADD CONSTRAINT "active_license_licenseId_fkey" FOREIGN KEY ("licenseId") REFERENCES "license"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
