/*
  Warnings:

  - Changed the type of `type` on the `plan` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "plan" DROP COLUMN "type",
ADD COLUMN     "type" "LicenseTierType" NOT NULL;

-- AlterTable
ALTER TABLE "subscription" ALTER COLUMN "licenseId" DROP NOT NULL;

-- DropEnum
DROP TYPE "PlanType";
