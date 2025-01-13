-- CreateTable
CREATE TABLE "user_referrals" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "invitedUserIds" TEXT[],

    CONSTRAINT "user_referrals_pkey" PRIMARY KEY ("id")
);
