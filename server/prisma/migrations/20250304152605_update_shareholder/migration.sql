/*
  Warnings:

  - You are about to drop the column `name` on the `user_shareholders_data` table. All the data in the column will be lost.
  - Added the required column `countryCode` to the `user_shareholders_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `user_shareholders_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `user_shareholders_data` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_shareholders_data" DROP COLUMN "name",
ADD COLUMN     "countryCode" TEXT NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL;
