-- DropForeignKey
ALTER TABLE "active_license" DROP CONSTRAINT "active_license_userId_fkey";

-- DropForeignKey
ALTER TABLE "license" DROP CONSTRAINT "license_ownerId_fkey";

-- AddForeignKey
ALTER TABLE "license" ADD CONSTRAINT "license_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "active_license" ADD CONSTRAINT "active_license_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
