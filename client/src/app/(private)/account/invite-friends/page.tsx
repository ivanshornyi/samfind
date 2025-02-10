"use client";

import { useContext } from "react";
import { AuthContext } from "@/context";
import { useToast, useGetUserReferralUsers } from "@/hooks";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell
} from "@/components/ui/table";

import { Copy } from "lucide-react";

import {
  BalanceInfo,
  ReferralInfo,
  SharePopover,
} from "./_components";

import { format } from "date-fns";

const frontendDomain = process.env.NEXT_PUBLIC_FRONTEND_DOMAIN;

export default function InvitedFriends() {
  const { user } = useContext(AuthContext);
  const { toast } = useToast();

  const handleCopyReferralCodeLink = () => {
    if (user) {
      const link = `${frontendDomain}/auth/referal-account?referralCode=${user.referralCode}`;

      navigator.clipboard.writeText(link);

      toast({
        title: "Success",
        description: "Copied",
        variant: "success",
      });
    }
  };

  const { data: userReferralItems, isPending: isUserReferralItemsLoading } = useGetUserReferralUsers();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    return format(date, "MMMM dd, yyyy");
  }

  if (!user) return null;

  const referralLink = `${frontendDomain}/auth/sign-up?accountType=private&referralCode=${user.referralCode}`;

  return (
    <>
      <div className="flex items-end gap-[55px] mx-auto mb-16">
        <div className="flex flex-col">
          <div className="flex justify-between mb-6">
            <h2 className="text-2xl sm:text-[32px] leading-[44px] font-semibold">
              Invite a Friend
            </h2>
            <div className="lg:hidden">
              <BalanceInfo balance={user.discount / 100} />
            </div>
          </div>
          <ReferralInfo />

          <div className="space-y-4 md:space-y-2 w-full">
            <h3 className="text-base font-medium">
              Your referral link is active.
            </h3>
            <h4 className="text-[#A8A8A8] font-normal text-xs">
              Make sure to share it with your friends before the deadline to
              earn rewards!
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
          <BalanceInfo balance={(user.discount / 100)} />
        </div>
      </div>
      
      <div className="w-full mt-5 mb-[100px]">
        <Table>
          <TableHeader className="hover:bg-transparent">
            <TableRow className="border-white/30 hover:bg-transparent">
              <TableHead className="w-[80px]"></TableHead>
              <TableHead className="uppercase text-white/60">Name</TableHead>
              <TableHead className="uppercase text-white/60">Date of activation</TableHead>
              <TableHead className="uppercase text-white/60">Payout</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userReferralItems?.map((referralUser) => (
              <TableRow key={referralUser.userId} className="border-none hover:bg-transparent">
                <TableCell>
                  <div className="py-3">
                    <div className="bg-card w-[50px] h-[50px] rounded-full flex items-center justify-center text-2xl text-blue-50">
                      <span>{referralUser.name[0]}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{referralUser.name}</TableCell>
                <TableCell>{referralUser.activationDate && formatDate(referralUser.activationDate)}</TableCell>
                <TableCell>
                  <p className="text-[#4BB543]">{(referralUser.amount / 100).toFixed(2)}</p>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {!isUserReferralItemsLoading && userReferralItems?.length === 0 && (
          <div className="py-[50px]">
            <p className="text-center text-white/60 w-full">This is where your income from registrations will be displayed</p>
          </div>
        )}

        {isUserReferralItemsLoading && (
          <div className="py-[50px] text-center">
            <p>Loading...</p>
          </div>
        )}
      </div>
    </>
  );
}
