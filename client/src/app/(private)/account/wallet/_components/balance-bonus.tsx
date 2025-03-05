import * as Popover from "@radix-ui/react-popover";
import { Info } from "lucide-react";
import { ConvertToDiscountModal } from "./convert-to-discount-modal";

interface BalanceInfoProps {
  balance: number;
}

export const BalanceBonus = ({ balance }: BalanceInfoProps) => {
  return (
    <div className="flex flex-col justify-between items-start rounded-2xl bg-[#242424] relative w-full h-[260px] p-4">
      <div>
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
              The amount of funds you’ve earned through referrals or other
              activities in the system. You can transfer them to discount or buy
              shares
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
        <p className="text-[20px] leading-[27px] font-semibold">
          Your bonus balance
        </p>
        <p className="text-[16px] leading-[22px] mt-4">
          Total amount of bonuses from referrals
        </p>

        <p className="text-2xl sm:text-[32px] sm:leading-[43px] font-semibold text-[#CE9DF3] text-nowrap mb-2 md:mb-4 md:mt-2">
          €{balance / 100}
        </p>
        <div className="flex">
          <ConvertToDiscountModal />
        </div>
      </div>
    </div>
  );
};
