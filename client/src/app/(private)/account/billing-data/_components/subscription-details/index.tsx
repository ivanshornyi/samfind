"use client";
import { Button } from "@/components/ui";
import { User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ManageSubscriptionModal } from "../manage-subscription-modal";

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
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-semibold">Plans and Billing</h1>
      </div>
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-xl">Plan</h2>
        <Button
          variant="ghost"
          className="rounded-full ml-auto flex items-center gap-2 text-[#A8A8FF] hover:text-[#A8A8FF] bg-[#292832] hover:bg-[#383838]"
        >
          <User size={16} />
          Personal account
        </Button>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-4">
            <h3 className="text-2xl font-semibold">{plan}</h3>
            <span className="text-[#4BB543] bg-[#292832] px-2 py-1 rounded-full">
              {status}
            </span>
          </div>
          <p className="text-[#C4C4C4] mt-1">Renews on {renewalDate}</p>
        </div>
        <div>
          <Button
            variant="ghost"
            className="text-[#A8A8FF]"
            onClick={() => setIsManageModalOpen(true)}
          >
            Manage subscription
          </Button>
        </div>
      </div>
      <div className="h-[1px] flex-grow bg-[#383838]" />

      <div className="flex items-center gap-2">
        <span className="text-2xl font-semibold">
          <span className="text-lg">$</span>
          {price}
        </span>
        <span className="text-[#C4C4C4]">/{billingPeriod}</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[#C4C4C4]">
          ({members.admin} Admin, {members.regular} members)
        </span>
        <Link href="/account/license" className="text-[#A8A8FF]">
          Manage members
        </Link>
      </div>

      <ManageSubscriptionModal
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
      />
    </div>
  );
};
