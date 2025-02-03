import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
} from "react-share";
import {
  YoutubeIcon,
  TwitterIcon,
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
} from "@public/icons";
import { SquareArrowOutUpRight } from "lucide-react";
import Image from "next/image";

export const ShareTooltip = ({ url }: { url: string }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger className="bg-[#242424] rounded-[30px] p-2">
        <SquareArrowOutUpRight className="text-violet-50" />
      </TooltipTrigger>
      <TooltipContent className="p-4 bg-[#232323] max-w-[300px] rounded-[30px] space-y-3 z-[1]">
        <p className="font-medium text-base">Share your link</p>
        <div className="flex gap-6">
          <Image src={YoutubeIcon} width={24} height={24} alt="youtube" />
          <TwitterShareButton url={url}>
            <Image src={TwitterIcon} width={24} height={24} alt="twitter" />
          </TwitterShareButton>
          <FacebookShareButton url={url}>
            <Image src={FacebookIcon} width={24} height={24} alt="facebook" />
          </FacebookShareButton>
          <Image src={InstagramIcon} width={24} height={24} alt="instagram" />
          <LinkedinShareButton url={url}>
            <Image src={LinkedinIcon} width={24} height={24} alt="linkedin" />
          </LinkedinShareButton>
        </div>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);
