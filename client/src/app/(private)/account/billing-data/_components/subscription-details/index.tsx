"use client";

import Link from "next/link";

import { ManageSubscriptionModal } from "../manage-subscription-modal/manage-subscription-modal";
import { UserAccountTypeBox } from "@/components";

interface SubscriptionDetailsProps {
  plan: string;
  status: string;
  renewalDate: string;
  price: number;
  billingPeriod: string;
  members: {
    admin: number;
    regular: number;
  };
}

export const SubscriptionDetails = ({
  plan,
  status,
  renewalDate,
  price,
  billingPeriod,
  members,
}: SubscriptionDetailsProps) => {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h2 className="text-xl">Plan</h2>
        <UserAccountTypeBox />
      </div>
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-4">
            <h3 className="text-2xl capitalize font-semibold">{plan}</h3>
            <span className="text-[#4BB543] bg-[#292832] px-2 py-1 rounded-full">
              {status}
            </span>
          </div>
          <p className="text-[#C4C4C4] mt-1">Renews on {renewalDate}</p>
        </div>
        <div></div>
      </div>
      <div className="h-[1px] flex-grow bg-[#383838]" />

      <div className="flex items-end">
        <span className="text-2xl font-semibold">
          <span className="text-lg">€</span>
          {price}
        </span>
        <span className="text-[#C4C4C4]">/{billingPeriod}</span>
      </div>

      <div className="flex items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[#C4C4C4]">
            ({members.admin} Admin, {members.regular} members)
          </span>
          <Link href="/account/license" className="text-blue-50">
            Manage members
          </Link>
        </div>

        <ManageSubscriptionModal />
      </div>
    </div>
  );
};
