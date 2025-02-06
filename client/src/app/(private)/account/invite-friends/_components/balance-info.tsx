import * as Popover from "@radix-ui/react-popover";
import { Info } from "lucide-react";

export const BalanceInfo = ({ balance }: { balance: number }) => (
  <div className="h-fit rounded-2xl bg-[#242424] p-6 md:p-8 relative">
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
          Your balance is the amount of funds you’ve earned through referrals or
          other activities in the system.
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
    <p className="text-2xl sm:text-[32px] sm:leading-[43px] font-semibold text-[#CE9DF3] text-nowrap mb-2 md:mb-4 md:mt-2">
      $ {balance.toFixed(2)}
    </p>
    <p className="text-base md:text-xl font-normal text-nowrap">
      Your discount
    </p>
  </div>
);
