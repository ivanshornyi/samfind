/*
  Warnings:

  - You are about to drop the column `userId` on the `license` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ownerId]` on the table `organization` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ownerId` to the `license` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerId` to the `organization` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LicenseTierType" AS ENUM ('freemium', 'standard');

-- DropForeignKey
ALTER TABLE "license" DROP CONSTRAINT "license_userId_fkey";

-- AlterTable
ALTER TABLE "license" DROP COLUMN "userId",
ADD COLUMN     "count" DOUBLE PRECISION NOT NULL DEFAULT 1,
ADD COLUMN     "ownerId" TEXT NOT NULL,
ADD COLUMN     "tierType" "LicenseTierType" NOT NULL DEFAULT 'freemium',
ADD COLUMN     "userIds" TEXT[];

-- AlterTable
ALTER TABLE "organization" ADD COLUMN     "ownerId" TEXT NOT NULL,
ADD COLUMN     "userIds" TEXT[];

-- CreateIndex
CREATE UNIQUE INDEX "organization_ownerId_key" ON "organization"("ownerId");

-- AddForeignKey
ALTER TABLE "license" ADD CONSTRAINT "license_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
