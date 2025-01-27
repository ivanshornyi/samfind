/*
  Warnings:

  - You are about to drop the column `domain` on the `organization` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "license" ADD COLUMN     "availableEmails" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "organization" DROP COLUMN "domain",
ADD COLUMN     "availableEmails" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "domains" TEXT[] DEFAULT ARRAY[]::TEXT[];
