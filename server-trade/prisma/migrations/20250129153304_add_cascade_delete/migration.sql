-- DropForeignKey
ALTER TABLE "user_referral" DROP CONSTRAINT "user_referral_userId_fkey";

-- AddForeignKey
ALTER TABLE "user_referral" ADD CONSTRAINT "user_referral_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
