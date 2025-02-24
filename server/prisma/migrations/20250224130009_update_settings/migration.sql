/*
  Warnings:

  - You are about to alter the column `sharePrice` on the `app_settings` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "app_settings" ALTER COLUMN "sharePrice" SET DATA TYPE INTEGER;
