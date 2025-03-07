"use client";

import { ArrowUpRight } from "lucide-react";

export function InvestFAQ(): React.ReactNode {
  return (
    <section aria-label="investment-hero" className="pt-[100px]">
      <div
        aria-label="wrapper"
        className="mx-auto flex gap-[50px] w-full max-w-[1440px] px-[140px]"
      >
        <div className="w-[50%] flex flex-col gap-[25px]">
          <h2 className="text-white text-[48px] font-[600]">
            Invest Early. Gain More.
          </h2>
          <p className="text-white text-[16px] font-[600]">
            Join as an Early Bird investor and unlock exclusive benefits, or
            contact us if you're a major investor
          </p>
        </div>
        <div className="flex items-end justify-center">
          <div className="flex gap-[16px] items-center">
            <button
              aria-label="Early Bird campaign assignment"
              className="rounded-[30px] py-[8px] px-[32px] border border-customGreyButton bg-white backdrop-blur-customPinkButtonBGRGBA text-customSaturedPinkButtonText text-[16px] font-[500]"
            >
              Join as an Early Bird
            </button>
            <button className="text-white text-[16px] font-[500] flex gap-[8px] items-center">
              Become a Key Investor
              <ArrowUpRight className="w-[30px] h-[30px]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
