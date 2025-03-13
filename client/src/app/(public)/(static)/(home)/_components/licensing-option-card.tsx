"use client";

import { useRouter } from "next/navigation";

import { LicensingOptionType } from "../_types";

import { Button } from "@/components";
import { CheckOutline } from "@public/home";

import Image from "next/image";
import { AuthContext } from "@/context";
import { useContext } from "react";
import { PlanPeriod } from "@/types";

export const LicensingOptionCard = ({
  option,
  isLarge,
}: {
  option: LicensingOptionType;
  isLarge: boolean;
}) => {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  return (
    <div
      className={`flex-1 ${isLarge ? "bg-[#302935]" : "bg-card"} px-6 py-8 rounded-[20px] transition-all hover:shadow-[0_2px_20px_0_#B668F080]`}
    >
      <h3 className="font-semibold text-[32px] leading-[43px] mb-4 first-letter:uppercase">
        {option.title}
      </h3>
      <p className="font-normal text-base mb-6">{option.description}</p>

      {option.price !== 0 ? (
        <div className="mb-6 flex gap-2 items-center justify-between">
          <div className="flex items-center">
            {/* <div className="flex items-start justify-end">
              <Image src={DollarIcon} alt="dollar" width={23} height={49} />
            </div> */}
            <p className="font-semibold text-5xl text-[#DCDCDC] leading-[52px]">
              €{option.price}
              <span className="text-[32px]">
                {option.period === PlanPeriod.Monthly ? "/month" : "/year"}
              </span>
            </p>
          </div>
        </div>
      ) : null}

      <Button
        variant={option.buttonVariant}
        className={`w-full mb-6 border-none ${isLarge ? "py-[13px]" : ""}`}
        onClick={() =>
          router.push(user ? "/account/billing-data" : "/auth/account-type")
        }
      >
        {option.buttonText}
      </Button>

      <ul className="space-y-[10px]">
        {option.features.map((feature, index) => (
          <li key={index} className="flex items-center gap-[20px]">
            <Image src={CheckOutline} width={24} height={24} alt="Checkmark" />
            <span className="font-normal text-xl">{feature}</span>
          </li>
        ))}
      </ul>

      {option.footerText ? (
        <div className="w-fit py-[6.4px] px-[25.61px] rounded-3xl bg-[#242424] mt-10">
          <span className="font-medium text-base text-[#CE9DF3]">
            {option.footerText}
          </span>
        </div>
      ) : null}
    </div>
  );
};
