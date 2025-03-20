"use client";

import { QuantitySelector } from "@/components";
import { useEffect, useState } from "react";

interface Props {
  sharePrice: number;
}

// 1, 57 / 0,01416 * 100 / 100 * 5 = 554, 378531

export function InvestCalcPrice({ sharePrice }: Props): React.ReactNode {
  const [amountOfShare, setAmountOfShare] = useState<number>(1);
  const [calculatedPrice, setCalculatedPrice] = useState<number>(0);

  const changeQuantity = (val: number) => {
    setAmountOfShare(val < 1 ? 1 : val);
  };

  function handleCalculatePrice(): void {
    const result = (((sharePrice / 0.01416) * 100) / 100) * 5 * amountOfShare;
    setCalculatedPrice(Math.round(result));
  }

  useEffect(() => {
    handleCalculatePrice();
  }, [amountOfShare, sharePrice]);

  return (
    <section
      aria-label="investment-calculation-section"
      className="sm:px-[22px] sm:mt-[145px] mt-[60px]"
    >
      <div
        aria-label="wrapper"
        className="flex flex-col gap-[40px] max-w-[1440px] mx-auto sm:py-[90px] sm:px-[280px] bg-customBlackTags rounded-[20px] relative z-[3]"
      >
        <div
          aria-label="bg-ball"
          className="absolute opacity-[75%] z-[-1] top-[-15%] left-[40%] w-[301px] h-[827px] rounded-[830px] bg-customBoulderBallPinkBGRGBA blur-customBoulderBallPinkBGRGBA rotate-[98deg]"
        />
        <div className="flex flex-col gap-[16px]">
          <h2 className="text-white sm:text-[48px] text-[24px] font-[600]">
            Curious about your future gains?
          </h2>
          <p className="text-white sm:text-[20px] text-[16px] font-[500] text-center">
            Calculate how much you could earn if our company reaches just 5% of{" "}
            <br /> OpenAI’s value.
          </p>
        </div>
        <div className="flex flex-col gap-[40px] items-center justify-center">
          <div className="flex gap-[80px] items-center justify-center">
            <div className="flex flex-col justify-between sm:w-[130px] h-[83px] items-center">
              <p className="text-customGreyColorSubText sm:text-[15px] text-[12px] font-[600] leading-[18px] text-center">
                Current price per share
              </p>
              <p className="sm:text-[24px] text-[16px] font-[600]">
                €{sharePrice}
              </p>
            </div>
            <div className="flex flex-col gap-[20px] items-center">
              <p className="text-customGreyColorSubText sm:text-[15px] text-[12px]font-[600] leading-[18px]">
                Number of shares
              </p>
              <QuantitySelector
                value={amountOfShare}
                onChange={changeQuantity}
                minValue={1}
              />
            </div>
            <div className="flex flex-col gap-[20px] sm:w-[130px] min-w-[91px] items-center">
              <p className="text-customGreyColorSubText sm:text-[15px] text-[12px]  font-[600] leading-[18px]">
                Total
              </p>
              <p className="sm:text-[24px] text-[16px] font-[600]">
                €{Math.round(sharePrice * amountOfShare * 100) / 100}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-[8px] items-center">
            <p className="text-customGreyColorSubText sm:text-[15px] text-[12px]  font-[600] leading-[18px]">
              Potential value
            </p>
            <p className="text-customPinkSubText sm:text-[40px] text-[24px] font-[600]">
              € {calculatedPrice}
            </p>
          </div>
          <p className="text-customGreyCoalSubText sm:text-[16px] text-[14px] font-[600]">
            See Your Potential Returns – Invest Smart Today!{" "}
          </p>
        </div>
      </div>
    </section>
  );
}
