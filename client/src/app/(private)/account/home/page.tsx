"use client";

import { useContext } from "react";

import { AuthContext } from "@/context";

import { useToast } from "@/hooks";

const frontendDomain = process.env.NEXT_PUBLIC_FRONTEND_DOMAIN;

export default function Home() {
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

  const handleCopyInvitation = () => {
    if (user) {
      let link = `${frontendDomain}/auth/sign-up?accountType=private`;

      if (user.organizationId) {
        link = `${link}&orgId=${user.organizationId}`;
      }

      if (user.licenseId) {
        link = `${link}&lId=${user.licenseId}`;
      }
 
      navigator.clipboard.writeText(link); 

      toast({
        description: "Copied",
      });
    }
  };

  return (
    <div>
      <p>Home page</p>

      <div className="flex flex-col gap-2 mt-3">
        <button
          onClick={handleCopyReferralCodeLink}
          className="rounded-full p-3 w-[240px] bg-secondary"
        >
          Copy referral invitation link
        </button>
        <button
          onClick={handleCopyInvitation}
          className="rounded-full p-3 w-[240px] bg-secondary"
        >
          Copy license invitation link
        </button>
      </div>
    </div>
  );
}