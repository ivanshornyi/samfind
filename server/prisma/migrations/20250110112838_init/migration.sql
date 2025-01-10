-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "UserAuthType" AS ENUM ('email', 'google');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'customer');

-- CreateTable
CREATE TABLE "user" (
    "email" TEXT NOT NULL,
    "password" VARCHAR NOT NULL,
    "firstName" VARCHAR NOT NULL,
    "lastName" VARCHAR NOT NULL,
    "authType" "UserAuthType" NOT NULL,
    "refreshToken" VARCHAR,
    "id" BIGSERIAL NOT NULL,
    "status" "UserStatus" NOT NULL,
    "resetCode" VARCHAR,
    "role" "UserRole" NOT NULL,
    "resetCodeExpiresAt" BIGINT,
    "emailResetCode" VARCHAR,
    "emailResetCodeExpiresAt" BIGINT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_license" (
    "id" BIGSERIAL NOT NULL,
    "userId" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "key" VARCHAR NOT NULL,

    CONSTRAINT "user_license_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
