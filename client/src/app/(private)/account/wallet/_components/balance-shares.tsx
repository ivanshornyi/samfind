import * as Popover from "@radix-ui/react-popover";
import { Info } from "lucide-react";
import { BuyShares } from "./buy-shares-modal";

interface BalanceInfoProps {
  balance: number;
  sharePrice: number;
  bonusAmount: number;
}

export const BalanceShares = ({
  balance,
  sharePrice,
  bonusAmount,
}: BalanceInfoProps) => {
  return (
    <div className="flex flex-col justify-between items-start rounded-2xl bg-[#242424] relative w-full p-8">
      <div className="w-full">
        <Popover.Root>
          <Popover.Trigger className="absolute top-4 right-5">
            <Info size={14} />
          </Popover.Trigger>
          <Popover.Anchor />
          <Popover.Portal>
            <Popover.Content
              side="top"
              sideOffset={20}
              className="p-4 bg-[#232323] max-w-[300px] rounded-[30px] text-xs font-medium text-[#A8A8A8] z-[10]"
              style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.25)" }}
            >
              Balance of the number of company shares
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
        <p className="text-[20px] leading-[27px] font-semibold">Your Shares</p>
        <div className="flex mt-2 md:mt-8 justify-between">
          <div>
            <p className="text-[16px] leading-[22px]">Shares owned</p>
            <p className="text-2xl sm:text-[32px] sm:leading-[43px] font-semibold text-[#CE9DF3] text-nowrap mb-2 md:mb-4">
              €{(balance * sharePrice) / 100}
            </p>
          </div>
          <div className="flex flex-col gap-2 text-[16px] leading-[22px] text-disabled">
            <div className="flex gap-2">
              <p>Shares owned:</p>
              <p className="text-white">{balance}</p>
            </div>
            <div className="flex gap-2">
              <p>Current share price:</p>
              <p className="text-white">€{sharePrice / 100}</p>
            </div>
            <div className="flex gap-2">
              <p>Last price update:</p>
              <p className="text-white">Today</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 w-full mt-4">
          <BuyShares sharePrice={sharePrice} bonusAmount={bonusAmount} />
        </div>
      </div>
    </div>
  );
};
