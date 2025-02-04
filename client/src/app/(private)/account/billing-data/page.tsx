"use client";

import { useGetPlans, useGetUserLicenses, useGetUserSubscriptionInfo } from "@/hooks";

import { PaymentHistory, SubscriptionDetails, PlanCard } from "./_components";
import { useEffect } from "react";

export default function BillingData() {
  const { data: plans } = useGetPlans();

  const { data: userLicense, isPending: isUserLicensePending } = useGetUserLicenses();

  const { data: userSubscriptionInfo } = useGetUserSubscriptionInfo();

  return (
    <div className="w-full text-white">
      <div className="space-y-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-semibold">Plans and Billing</h1>
        </div>

        <div>
          {userLicense && !isUserLicensePending && !userSubscriptionInfo?.freemiumUser && (
            <SubscriptionDetails
              plan="Standart Monthly"
              status="Active subscription"
              renewalDate="February 02, 2025"
              price={9.99}
              billingPeriod="month, billed monthly"
              members={{ admin: 1, regular: 0 }}
            />
          )}

          {(!userLicense || userSubscriptionInfo?.freemiumUser) && (
            <div className="flex gap-2">
              {plans?.map(plan => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-xl">Payment history</h2>
          </div>
          <PaymentHistory />
        </div>
      </div>
    </div>
  );
}
