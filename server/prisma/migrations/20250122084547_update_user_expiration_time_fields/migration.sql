/*
  Warnings:

  - The `resetCodeExpiresAt` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `emailResetCodeExpiresAt` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "resetCodeExpiresAt",
ADD COLUMN     "resetCodeExpiresAt" TIMESTAMP(3),
DROP COLUMN "emailResetCodeExpiresAt",
ADD COLUMN     "emailResetCodeExpiresAt" TIMESTAMP(3);
