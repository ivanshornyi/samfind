-- AlterTable
ALTER TABLE "license" ALTER COLUMN "userIds" SET DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "organization" ALTER COLUMN "userIds" SET DEFAULT ARRAY[]::TEXT[];
