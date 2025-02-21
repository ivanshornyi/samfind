/*
  Warnings:

  - You are about to drop the column `spentBonuses` on the `discount` table. All the data in the column will be lost.
  - You are about to drop the column `spentDiscount` on the `discount` table. All the data in the column will be lost.
  - You are about to drop the column `selectedBonusToDiscount` on the `wallet` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "discount" DROP COLUMN "spentBonuses",
DROP COLUMN "spentDiscount";

-- AlterTable
ALTER TABLE "wallet" DROP COLUMN "selectedBonusToDiscount";
