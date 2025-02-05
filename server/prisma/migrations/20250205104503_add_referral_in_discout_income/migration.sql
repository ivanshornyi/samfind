-- AlterTable
ALTER TABLE "discount_income" ADD COLUMN     "referralId" TEXT;

-- AddForeignKey
ALTER TABLE "discount_income" ADD CONSTRAINT "discount_income_referralId_fkey" FOREIGN KEY ("referralId") REFERENCES "user_referral"("id") ON DELETE SET NULL ON UPDATE CASCADE;
