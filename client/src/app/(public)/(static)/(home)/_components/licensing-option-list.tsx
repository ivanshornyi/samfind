"use client";

import { useGetPlans } from "@/hooks";
import { LicensingOptionCard } from "./licensing-option-card";
import { LicensingOptionType } from "../_types";
import { useEffect, useState } from "react";
import { PlanPeriod, PlanType } from "@/types";

export const LicensingOptionList = () => {
  const { data: plans } = useGetPlans();
  console.log("plans: ", plans);
  const [planOptions, setPlanOptions] = useState<LicensingOptionType[]>([]);

  useEffect(() => {
    if (plans?.length) {
      const newPlanOptions: LicensingOptionType[] = plans.map((plan) => {
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
            background: "bg-card",
            border: "",
            ulText: "",
          };
        } else if (plan.type === PlanType.EarlyBird)
          return {
            id: plan.id,
            title:
              plan.type === PlanType.EarlyBird
                ? "Early Bird Campaign"
                : plan.type +
                  "  " +
                  `${plan.period === PlanPeriod.Monthly ? "Monthly" : "Yearly"}`,
            tierType: plan.type,
            period: plan.period,
            description: "6 shares = 1 month of using all Onsio tools for free",
            price: plan.price / 100,
            buttonText: "Buy Standard",
            buttonVariant: "purple",
            features: [
              "All the benefits of a monthly subscription",
              "Free access to our platform (web, mobile, desktop)",
              "The potential to sell shares later for profit",
              "Be part of the company’s growth",
            ],
            footerText: undefined,
            isPremium: true,
            background: "bg-[#1F1E1F]",
            border: "bg-gradient-to-r from-[#A8A8A8] to-[#A64CE8]",
            ulText: "Exclusive perks for shareholders:",
          };
        else {
          return {
            id: plan.id,
            title: `Standard ${plan.period === PlanPeriod.Monthly ? "Monthly" : "Yearly"}`,
            period: plan.period,
            tierType: plan.type,
            description: "Essential features for personal and community use",
            price: plan.price / 100,
            buttonText: "Buy Standard",
            buttonVariant: "default",
            features: [
              "Essential features",
              "Community access",
              "Basic support",
            ],
            footerText: undefined,
            isPremium: false,
            background: "bg-[#302935]",
            border: "",
            ulText: "",
          };
        }
      });

      newPlanOptions.sort((a, b) => {
        if (a.title === "Freemium") return 1;
        if (b.title === "Freemium") return -1;
        if (
          a.period === PlanPeriod.Monthly &&
          b.period !== PlanPeriod.Monthly
        ) {
          return -1;
        }
        if (
          a.period !== PlanPeriod.Monthly &&
          b.period === PlanPeriod.Monthly
        ) {
          return 1;
        }
        if (a.period === PlanPeriod.Yearly && b.period !== PlanPeriod.Yearly) {
          return -1;
        }
        if (a.period !== PlanPeriod.Yearly && b.period === PlanPeriod.Yearly) {
          return 1;
        }
        return a.price - b.price;
      });

      setPlanOptions(newPlanOptions);
    }
  }, [plans]);
  return (
    <div id="pricing" className="mt-20 sm:mt-[120px] mb-20 mx-auto">
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
        {planOptions.map((option) => (
          <LicensingOptionCard
            key={option.id}
            option={option}
            isLarge={false}
          />
        ))}
      </div>
    </div>
  );
};
