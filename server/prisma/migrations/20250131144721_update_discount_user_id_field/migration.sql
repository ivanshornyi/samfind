/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `discount` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "discount_userId_key" ON "discount"("userId");
