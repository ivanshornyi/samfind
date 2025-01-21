-- CreateEnum
CREATE TYPE "UserAccountType" AS ENUM ('private', 'business');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "accountType" "UserAccountType" NOT NULL DEFAULT 'private',
ADD COLUMN     "organizationId" TEXT;

-- CreateTable
CREATE TABLE "organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "VAT" TEXT NOT NULL,
    "businessOrganizationNumber" TEXT NOT NULL,

    CONSTRAINT "organization_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
