import * as Popover from "@radix-ui/react-popover";
import { Info } from "lucide-react";

interface BalanceInfoProps {
  balance: number;
}

export const BalanceDiscount = ({ balance }: BalanceInfoProps) => {
  return (
    <div className="flex flex-col justify-between items-start rounded-2xl bg-[#242424] relative w-full md:w-[340px] h-[171px] p-8">
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
              The amount of money you received for the unused period of the
              license. These funds are automatically debited when you pay the
              next Invoice for the Subscription
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
        <p className="text-base md:text-xl font-normal text-nowrap">
          Your discount
        </p>
        <p className="text-[16px] leading-[22px] mt-4">
          Will be paid off next month
        </p>

        <p className="text-2xl sm:text-[32px] sm:leading-[43px] font-semibold text-[#CE9DF3] text-nowrap mb-2 md:mb-4 md:mt-2">
          €{balance / 100}
        </p>
      </div>
    </div>
  );
};
