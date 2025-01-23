-- AlterTable
ALTER TABLE "license" ALTER COLUMN "licenseExpiresAt" SET DEFAULT NOW() + interval '1 month';
