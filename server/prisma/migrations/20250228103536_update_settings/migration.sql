-- AlterTable
ALTER TABLE "app_settings" ADD COLUMN     "stripeTaxId" TEXT,
ALTER COLUMN "earlyBirdPeriod" SET DEFAULT false;
