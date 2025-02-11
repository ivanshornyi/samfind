"use client";
import { Plan } from "@/types";
import { useState } from "react";
import { AccountPlanSelector } from "../account-buttons";
import { pricingPlans } from "../mock-data";
import { PricingCard } from "../pricing-card";

export type AccountType = "personal" | "business";

const getFreemiumTitle = (accountType: AccountType) =>
  accountType === "personal" ? "Freemium" : "Freemium Business";

export const PricingPlans = () => {
  const [accountType, setAccountType] = useState<AccountType>("personal");

  const currentPricingPlans: any[] = pricingPlans.map((plan) =>
    plan.price === 0 ? { ...plan, title: getFreemiumTitle(accountType) } : plan
  );

  return (
    <div className="w-full text-white">
      <h1 className="text-4xl font-semibold mb-8">Plans and Billing</h1>

      <div className="flex flex-col space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl">Plan</h2>
          <AccountPlanSelector
            accountType={accountType}
            onAccountTypeChange={setAccountType}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {currentPricingPlans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} withButton />
          ))}
        </div>
      </div>
    </div>
  );
};
