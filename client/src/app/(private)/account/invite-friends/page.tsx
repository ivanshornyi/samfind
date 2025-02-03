"use client";

import { useContext } from "react";
import { AuthContext } from "@/context";
import { useToast } from "@/hooks";

import { Copy } from "lucide-react";

import { BalanceInfo, ReferralInfo, SharePopover } from "./_components";

const frontendDomain = process.env.NEXT_PUBLIC_FRONTEND_DOMAIN;

export default function InvitedFriends() {
  const { user } = useContext(AuthContext);
  const { toast } = useToast();

  const handleCopyReferralCodeLink = () => {
    if (user) {
      const link = `${frontendDomain}/auth/sign-up?accountType=private&referralCode=${user.referralCode}`;

      navigator.clipboard.writeText(link);

      toast({
        description: "Copied",
      });
    }
  };

  if (!user) return null;

  const referralLink = `${frontendDomain}/auth/sign-up?accountType=private&referralCode=${user.referralCode}`;

  return (
    <div className="flex items-end gap-[55px] mx-auto">
      <div className="flex flex-col">
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl sm:text-[32px] leading-[44px] font-semibold">
            Invite a Friend
          </h2>
          <div className="lg:hidden">
            <BalanceInfo balance={user.discount} />
          </div>
        </div>
        <ReferralInfo />

        <div className="space-y-4 md:space-y-2 w-full">
          <h3 className="text-base font-medium">
            Your referral link is active.
          </h3>
          <h4 className="text-[#A8A8A8] font-normal text-xs">
            Make sure to share it with your friends before the deadline to earn
            rewards!
          </h4>
          <div className="flex items-center w-full gap-4">
            <button
              onClick={handleCopyReferralCodeLink}
              className="w-full max-w-[420px] bg-[#242424] px-6 py-2 rounded-2xl flex gap-2 text-violet-50"
              aria-label="Copy referral link"
            >
              <Copy />
              <span className="text-base text-wrap">
                Copy the referral link
              </span>
            </button>
            <SharePopover url={referralLink} />
          </div>
        </div>
      </div>
      <div className="hidden lg:block">
        <BalanceInfo balance={user.discount} />
      </div>
    </div>
  );
}
