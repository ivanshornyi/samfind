/*
  Warnings:

  - You are about to drop the column `count` on the `license` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "license" DROP COLUMN "count",
ADD COLUMN     "limit" DOUBLE PRECISION NOT NULL DEFAULT 0;
