"use client";

import { useGetPlans, useGetUserLicenses, useGetUserSubscriptionInfo } from "@/hooks";

import { PaymentHistory, SubscriptionDetails } from "./_components";
import { PricingCard } from "./_components/pricing-card";

import { format } from "date-fns";

export default function BillingData() {
  const { data: plans } = useGetPlans();
  const { data: userLicense, isPending: isUserLicensePending } =
    useGetUserLicenses();

  const { data: userSubscriptionInfo } = useGetUserSubscriptionInfo();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    return format(date, "MMMM dd, yyyy");
  }

  return (
    <div className="w-full text-white">
      <div className="space-y-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-semibold">Plans and Billing</h1>
        </div>

        <div>
          {!isUserLicensePending && userLicense && userSubscriptionInfo && userLicense.tierType !== "freemium" && (
            <SubscriptionDetails
              plan={`${userSubscriptionInfo.plan.type} ${userSubscriptionInfo.plan.period}`}
              status="Active subscription"
              renewalDate={formatDate(userSubscriptionInfo.subscription.nextDate)}
              price={userSubscriptionInfo.plan.price / 100} // change to dollars
              billingPeriod={`month billed ${userSubscriptionInfo.plan.period}`}
              members={{ admin: 1, regular: userSubscriptionInfo.license.limit }}
            />
          )}

          {plans && (!userLicense || userLicense.tierType === "freemium") && (
            <div className="flex gap-2">
              {plans?.map((plan) => (
                <PricingCard key={plan.id} plan={plan} />
              ))}
            </div>
          )}
        </div>

        {/* <div>
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-xl">Payment history</h2>
          </div>
          <PaymentHistory />
        </div> */}
      </div>
    </div>
  );
}
