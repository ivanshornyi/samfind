"use client";

import { useGetPlans } from "@/hooks";
import { LicensingOptionCard } from "./licensing-option-card";
import { LicensingOptionType } from "../_types";
import { useEffect, useState } from "react";
import { PlanPeriod, PlanType } from "@/types";

export const LicensingOptionList = () => {
  const { data: plans } = useGetPlans();
  const [planOptions, setPlanOptions] = useState<LicensingOptionType[]>([]);

  useEffect(() => {
    if (plans?.length) {
      const newPlanOptions: LicensingOptionType[] = plans
        .filter((plan) => plan.type !== PlanType.EarlyBird)
        .map((plan) => {
          if (plan.type === PlanType.Freemium) {
            return {
              id: plan.id,
              title: "Freemium",
              period: plan.period,
              tierType: plan.type,
              description: "Essential features for personal and community use",
              price: 0,
              buttonText: "Get Started Free",
              buttonVariant: "secondary",
              features: [
                "Essential features",
                "Community access",
                "Basic support",
              ],
              footerText: "Community Edition",
              isPremium: false,
            };
          } else
            return {
              id: plan.id,
              title:
                plan.type +
                "  " +
                `${plan.period === PlanPeriod.Monthly ? "Monthly" : "Yearly"}`,
              tierType: plan.type,
              period: plan.period,
              description:
                "Boost your capabilities with premium features and priority support.",
              price: plan.price / 100,
              buttonText: "Buy Standard",
              buttonVariant: "default",
              features: [
                "Enhanced capabilities",
                "Priority updates",
                "Premium support",
              ],
              footerText: undefined,
              isPremium: true,
            };
        });

      setPlanOptions(newPlanOptions);
    }
  }, [plans]);
  return (
    <div
      id="pricing"
      className="mt-20 sm:mt-[120px] mb-20 mx-auto xl:w-[1200px]"
    >
      <div className="mb-[40px] sm:mb-[50px] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 lg:gap-0">
        <h2 className="text-2xl lg:text-[40px] font-semibold">
          Licensing Options
        </h2>
        <span className="font-medium text-base lg:text-xl">
          Adapt and evolve with your growing needs. Choose what <br /> works
          best for you.
        </span>
      </div>

      <div className="flex flex-col items-center ml:flex-row gap-5">
        {planOptions.map((option, index) => (
          <LicensingOptionCard
            key={option.id}
            option={option}
            isLarge={index % 2 !== 0}
          />
        ))}
      </div>
    </div>
  );
};
