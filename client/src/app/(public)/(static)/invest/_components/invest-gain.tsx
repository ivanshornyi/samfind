"use client";

import { useEffect, useState } from "react";

interface Props {
  sharePrice: number;
}

// 1, 57 / 0,01416 * 100 / 100 * 5 = 554, 378531

export function InvestCalcPrice({ sharePrice }: Props): React.ReactNode {
  const [amountOfShare, setAmountOfShare] = useState<number>(1);
  const [calculatedPrice, setCalculatedPrice] = useState<number>(0);

  function handleIncreaseShare(): void {
    setAmountOfShare((prev) => prev + 1);
  }

  function handleDecreaseShare(): void {
    setAmountOfShare((prev) => prev - 1);
  }

  function handleCalculatePrice(): void {
    const result = (((sharePrice / 0.01416) * 100) / 100) * 5 * amountOfShare;
    setCalculatedPrice(Math.round(result));
  }

  useEffect(() => {
    handleCalculatePrice();
  }, [amountOfShare]);

  return (
    <section
      aria-label="investment-calculation-section"
      className="px-[22px] mt-[145px]"
    >
      <div
        aria-label="wrapper"
        className="flex flex-col gap-[40px] max-w-[1440px] mx-auto py-[90px] px-[280px] bg-customBlackTags rounded-[20px] relative z-[3]"
      >
        <div
          aria-label="bg-ball"
          className="absolute opacity-[75%] z-[-1] top-[-15%] left-[40%] w-[301px] h-[827px] rounded-[830px] bg-customBoulderBallPinkBGRGBA blur-customBoulderBallPinkBGRGBA rotate-[98deg]"
        />
        <div className="flex flex-col gap-[16px]">
          <h2 className="text-white text-[48px] font-[600]">
            Curious about your future gains?
          </h2>
          <p className="text-white text-[20px] font-[500] text-center">
            Calculate how much you could earn if our company reaches just 5% of{" "}
            <br /> OpenAI’s value.
          </p>
        </div>
        <div className="flex flex-col gap-[40px] items-center justify-center">
          <div className="flex gap-[80px] items-center justify-center">
            <div className="flex flex-col gap-[20px]">
              <p className="text-customGreyColorSubText text-[15px] font-[600] leading-[18px]">
                Current price per share
              </p>
              <p className="text-[24px] font-[600]">${sharePrice}</p>
            </div>
            <div className="flex flex-col gap-[20px]">
              <p className="text-customGreyColorSubText text-[15px] font-[600] leading-[18px]">
                Number of shares
              </p>
              <div
                aria-label="amount calc"
                className="flex gap-[8px] items-center min-h-[44px] p-[8px] w-fit rounded-[16px] border border-customWhiteManager bg-customBlackManagerBG"
              >
                <button
                  className="text-white text-[24px] font-[400] leading-[17.6px] w-[24px]"
                  onClick={() => handleDecreaseShare()}
                >
                  -
                </button>
                <p className="text-white text-[16px] font-[400] leading-[17.6px] w-[32px] text-center">
                  {amountOfShare}
                </p>
                <button
                  className="text-white text-[24px] font-[400] leading-[17.6px] w-[24px]"
                  onClick={() => handleIncreaseShare()}
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-[20px]">
              <p className="text-customGreyColorSubText text-[15px] font-[600] leading-[18px]">
                Total
              </p>
              <p className="text-[24px] font-[600]">
                ${Math.round(sharePrice * amountOfShare * 100) / 100}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-[8px] items-center">
            <p className="text-customGreyColorSubText text-[15px] font-[600] leading-[18px]">
              Potential value
            </p>
            <p className="text-customPinkSubText text-[40px] font-[600]">
              $ {calculatedPrice}
            </p>
          </div>
          <p className="text-customGreyCoalSubText text-[16px] font-[600]">
            See Your Potential Returns – Invest Smart Today!{" "}
          </p>
        </div>
      </div>
    </section>
  );
}
