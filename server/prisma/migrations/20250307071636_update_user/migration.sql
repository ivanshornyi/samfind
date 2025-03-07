/*
  Warnings:

  - You are about to drop the column `language` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "language",
ADD COLUMN     "languageCode" TEXT,
ADD COLUMN     "languageName" TEXT;
