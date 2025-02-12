"use client";

import { useGetPlans } from "@/hooks";
import { licensingOptions } from "../_lib";
import { LicensingOptionCard } from "./licensing-option-card";
import { LicensingOptionType } from "../_types";
import { useEffect, useState } from "react";
import { PlanPeriod } from "@/types";

export const LicensingOptionList = () => {
  const { data: plans } = useGetPlans();
  const [planOptions, setPlanOptions] = useState<LicensingOptionType[]>([
    licensingOptions[0],
  ]);

  useEffect(() => {
    if (plans?.length) {
      const newPlanOptions: LicensingOptionType[] = plans.map((plan) => {
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

      setPlanOptions(() => [licensingOptions[0], ...newPlanOptions]);
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
