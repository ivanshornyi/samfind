"use client";

import {
  useGetPlans,
  useGetUserLicenses,
  useGetUserSubscriptionInfo,
} from "@/hooks";

import { PaymentHistory, SubscriptionDetails } from "./_components";
import { PricingCard } from "./_components/pricing-card";

import { format } from "date-fns";
import { PlanPeriod } from "@/types";
import { BonusHistoryModal } from "./_components/bonus-history-modal";

export default function BillingData() {
  const { data: plans, isPending: isPlansPending } = useGetPlans();
  const { data: userLicense, isPending: isUserLicensePending } =
    useGetUserLicenses();

  const {
    data: userSubscriptionInfo,
    isPending: isUserSubscriptionInfoPending,
  } = useGetUserSubscriptionInfo();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    return format(date, "MMMM dd, yyyy");
  };

  return (
    <div className="w-full text-white px-4 sm:px-6 lg:px-0">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        <div className="flex items-center justify-between mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">
            Plans and Billing
          </h1>
        </div>

        <div>
          {!isUserLicensePending &&
            userLicense &&
            !isUserSubscriptionInfoPending &&
            userSubscriptionInfo &&
            userLicense.tierType !== "freemium" && (
              <div className="w-full overflow-x-auto">
                <SubscriptionDetails
                  plan={`${userSubscriptionInfo.plan?.type} ${userSubscriptionInfo.plan?.period}`}
                  isActive={userSubscriptionInfo.isActive}
                  renewalDate={
                    userSubscriptionInfo.nextDate
                      ? formatDate(userSubscriptionInfo.nextDate)
                      : "no date"
                  }
                  price={userSubscriptionInfo.plan?.price / 100}
                  billingPeriod={
                    userSubscriptionInfo.plan?.period === PlanPeriod.Monthly
                      ? "month"
                      : "year"
                  }
                  members={{
                    admin: 1,
                    regular:
                      userSubscriptionInfo.license?._count.activeLicenses - 1,
                  }}
                />
              </div>
            )}

          {plans &&
            !isPlansPending &&
            (!userLicense || userLicense.tierType === "freemium") && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {plans?.map((plan) => (
                  <div key={plan.id} className="flex">
                    <PricingCard plan={plan} withButton={true} />
                  </div>
                ))}
              </div>
            )}
        </div>

        <div className="mt-8 sm:mt-12">
          <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold">
              Payment history
            </h2>
            <BonusHistoryModal />
          </div>
          <div className="w-full overflow-x-auto">
            <div className="min-w-[600px]">
              <PaymentHistory />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
