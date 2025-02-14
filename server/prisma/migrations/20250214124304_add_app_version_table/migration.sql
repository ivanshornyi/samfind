-- CreateEnum
CREATE TYPE "OsType" AS ENUM ('windows', 'mac', 'android', 'ios');

-- CreateTable
CREATE TABLE "app_version" (
    "id" TEXT NOT NULL,
    "osType" "OsType" NOT NULL,
    "version" TEXT NOT NULL,
    "url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "app_version_pkey" PRIMARY KEY ("id")
);
