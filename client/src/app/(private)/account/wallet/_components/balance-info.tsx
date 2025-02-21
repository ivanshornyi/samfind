import { Button, Input } from "@/components";
import { BalanceType } from "@/types";
import * as Popover from "@radix-ui/react-popover";
import { CircleCheckBig, CircleX, Info } from "lucide-react";
import { useState } from "react";

interface BalanceInfoProps {
  balanceType: BalanceType;
  balance: number;
  transferBonusToDiscount: (amount: number) => void;
}

const balancesDescription = {
  [BalanceType.Bonus]: {
    description: `The amount of funds you’ve earned through referrals
            or other activities in the system. You can transfer them to discount or buy shares`,
    name: "Your bonus",
    currency: "€",
  },
  [BalanceType.Discount]: {
    description: `The amount of money you received for the unused period of the license. These funds are automatically debited when you pay the next Invoice for the Subscription`,
    name: "Your discount",
    currency: "€",
  },
  [BalanceType.Shares]: {
    description: `Balance of the number of company shares`,
    name: "Your shares",
    currency: "",
  },
};

export const BalanceInfo = ({
  balance,
  balanceType,
  transferBonusToDiscount,
}: BalanceInfoProps) => {
  const [showConvert, setShowConvert] = useState(false);
  const [convertAmount, setConvertAmount] = useState("");
  const description = balancesDescription[balanceType];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    value = value.replace(/[^0-9.]/g, "");

    const dotCount = (value.match(/\./g) || []).length;
    if (dotCount > 1) {
      return;
    }

    if (value.includes(".")) {
      const [integer, decimal] = value.split(".");
      if (decimal.length > 2) {
        value = `${integer}.${decimal.slice(0, 2)}`;
      }
    }

    const numericValue = parseFloat(value);

    if (!isNaN(numericValue)) {
      if (numericValue < 0) {
        value = "0";
      } else if (numericValue > balance) {
        value = balance.toFixed(2);
      }
    }

    setConvertAmount(value);
  };

  const onClickTransfer = () => {
    const amount = Number(convertAmount) * 100;
    if (isNaN(amount) || amount <= 0) return;
    transferBonusToDiscount(Number(amount));
    setConvertAmount("");
    setShowConvert(false);
  };

  return (
    <div className="flex flex-col justify-between items-start rounded-2xl bg-[#242424] relative w-[200px] h-[171px] p-4">
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
              {description.description}
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
        <p className="text-base md:text-xl font-normal text-nowrap">
          {description.name}
        </p>
        <p className="text-2xl sm:text-[32px] sm:leading-[43px] font-semibold text-[#CE9DF3] text-nowrap mb-2 md:mb-4 md:mt-2">
          {description.currency} {"  "} {balance}
        </p>
        {balanceType === BalanceType.Bonus && balance > 0 && (
          <div>
            {showConvert ? (
              <div className="flex items-center gap-4">
                <Input
                  name="convertAmount"
                  type="text"
                  value={convertAmount}
                  onChange={handleInputChange}
                  placeholder="0.00"
                />
                <CircleCheckBig
                  onClick={onClickTransfer}
                  className="cursor-pointer"
                  size={40}
                />
                <CircleX
                  onClick={() => {
                    setConvertAmount("");
                    setShowConvert(false);
                  }}
                  className="cursor-pointer"
                  size={40}
                />
              </div>
            ) : (
              <Button
                onClick={() => {
                  setShowConvert(true);
                }}
                className="underline"
                variant="ghost"
              >
                Convert to discount
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
