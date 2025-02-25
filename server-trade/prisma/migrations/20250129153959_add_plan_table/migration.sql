-- CreateEnum
CREATE TYPE "PlanPeriod" AS ENUM ('monthly', 'yearly');

-- CreateEnum
CREATE TYPE "PlanType" AS ENUM ('free', 'standard');

-- DropForeignKey
ALTER TABLE "active_license" DROP CONSTRAINT "active_license_licenseId_fkey";

-- DropForeignKey
ALTER TABLE "active_license" DROP CONSTRAINT "active_license_userId_fkey";

-- DropForeignKey
ALTER TABLE "license" DROP CONSTRAINT "license_ownerId_fkey";

-- CreateTable
CREATE TABLE "plan" (
    "id" TEXT NOT NULL,
    "type" "PlanType" NOT NULL,
    "period" "PlanPeriod" NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "stripeProductId" TEXT,
    "stripePriceId" TEXT,

    CONSTRAINT "plan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "license" ADD CONSTRAINT "license_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "active_license" ADD CONSTRAINT "active_license_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "active_license" ADD CONSTRAINT "active_license_licenseId_fkey" FOREIGN KEY ("licenseId") REFERENCES "license"("id") ON DELETE CASCADE ON UPDATE CASCADE;
