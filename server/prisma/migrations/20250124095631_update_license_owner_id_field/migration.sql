/*
  Warnings:

  - A unique constraint covering the columns `[ownerId]` on the table `license` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "license_ownerId_key" ON "license"("ownerId");
