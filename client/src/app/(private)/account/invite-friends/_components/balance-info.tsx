import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

export const BalanceInfo = ({ balance }: { balance: number }) => (
  <div className="h-fit rounded-2xl bg-[#242424] p-6 md:p-8 relative">
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="absolute top-4 right-5">
          <Info size={14} />
        </TooltipTrigger>
        <TooltipContent className="p-4 bg-[#232323] max-w-[300px] rounded-[30px] text-xs font-medium text-[#A8A8A8] z-[10]">
          Your balance is the amount of funds you’ve earned through referrals or
          other activities in the system.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <p className="text-2xl sm:text-[32px] sm:leading-[43px] font-semibold text-[#CE9DF3] text-nowrap mb-2 md:mb-4 md:mt-2">
      $ {balance}
    </p>
    <p className="text-base md:text-xl font-normal text-nowrap">
      Your discount
    </p>
  </div>
);
