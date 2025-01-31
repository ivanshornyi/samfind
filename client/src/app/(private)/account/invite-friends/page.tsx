"use client";

import { useContext } from "react";

import { AuthContext } from "@/context";

import { useToast } from "@/hooks";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import {
  YoutubeIcon,
  TwitterIcon,
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
} from "@public/icons";
import { Copy, Info, SquareArrowOutUpRight } from "lucide-react";
import Image from "next/image";
import {
  TwitterShareButton,
  FacebookShareButton,
  LinkedinShareButton,
} from "react-share";

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

  return (
    <div className="flex items-end gap-[55px] w-[1000px] mx-auto">
      <div className="flex flex-col">
        <h2 className="text-[32px] leading-[44px] font-semibold mb-6">
          Invite a Friend
        </h2>
        <div className="flex gap-2 bg-[#242424] px-6 py-4 text-blue-50 font-medium text-base rounded-2xl mb-8">
          <Info />
          <div className="space-y-2">
            <p>
              Share the benefits of our service with your friends and get
              rewarded! Use your rewards from the internal wallet to offset your
              license costs.
            </p>
            <p>
              Your Friend Saves Too: Each friend who registers through your link
              gets a 10% discount on their first month.
            </p>
          </div>
        </div>
        <div className="space-y-2">
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
              className="w-full bg-[#242424] px-6 py-2 rounded-2xl flex gap-2 text-violet-50"
            >
              <Copy />
              <span className="text-base">http:link</span>
            </button>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <SquareArrowOutUpRight className="text-violet-50" />
                </TooltipTrigger>
                <TooltipContent className="p-4 bg-[#232323] max-w-[300px] rounded-[30px] space-y-3 z-[1]">
                  <p className="font-medium text-base">Share your link</p>
                  <div className="flex gap-6">
                    <Image
                      src={YoutubeIcon}
                      width={24}
                      height={24}
                      alt="youtube"
                    />
                    <TwitterShareButton url="https://example.com">
                      <Image
                        src={TwitterIcon}
                        width={24}
                        height={24}
                        alt="twitter"
                      />
                    </TwitterShareButton>
                    <FacebookShareButton url="https://example.com">
                      <Image
                        src={FacebookIcon}
                        width={24}
                        height={24}
                        alt="facebook"
                      />
                    </FacebookShareButton>
                    <Image
                      src={InstagramIcon}
                      width={24}
                      height={24}
                      alt="instagram"
                    />
                    <LinkedinShareButton url="https://example.com">
                      <Image
                        src={LinkedinIcon}
                        width={24}
                        height={24}
                        alt="linkedin"
                      />
                    </LinkedinShareButton>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
      <div className="h-fit rounded-2xl bg-[#242424] p-8 relative">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="absolute top-4 right-5">
              <Info size={14} />
            </TooltipTrigger>
            <TooltipContent className="p-4 bg-[#232323] max-w-[300px] rounded-[30px] text-xs font-medium text-[#A8A8A8]">
              Your balance is the amount of funds you’ve earned through
              referrals or other activities in the system.
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <p className="text-[32px] leading-[43px] font-semibold text-[#CE9DF3] text-nowrap mb-4 mt-2">
          $ {user?.discount}
        </p>
        <p className="text-xl font-normal text-nowrap">Your balance</p>
      </div>
    </div>
  );
}
