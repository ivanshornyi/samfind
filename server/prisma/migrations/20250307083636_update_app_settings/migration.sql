/*
  Warnings:

  - You are about to drop the column `stripeTaxId` on the `app_settings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "app_settings" DROP COLUMN "stripeTaxId",
ADD COLUMN     "stripeTaxAddedId" TEXT,
ADD COLUMN     "stripeTaxInclusive" TEXT;
