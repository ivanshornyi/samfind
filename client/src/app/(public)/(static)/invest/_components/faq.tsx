"use client";

import { ArrowUpRight } from "lucide-react";

export function InvestFAQ(): React.ReactNode {
  return (
    <section aria-label="investment-hero" className="pt-[100px]">
      <div
        aria-label="wrapper"
        className="mx-auto flex gap-[50px] w-full min-w-[360px] max-w-[1440px] sm:px-[140px] sm:flex-row flex-col sm:justify-between"
      >
        <div className="sm:w-[50%] min-w-[360px] flex flex-col gap-[25px]">
          <h2 className="text-white sm:text-[48px] text-[24px] font-[600]">
            Invest Early. Gain More.
          </h2>
          <p className="text-white text-[16px] font-[600]">
            Join as an Early Bird investor and unlock exclusive benefits, or
            contact us if you're a major investor
          </p>
        </div>
        <div className="flex items-end justify-center">
          <button
            aria-label="Early Bird campaign assignment"
            className="rounded-[30px] py-[8px] px-[32px] border border-customGreyButton bg-white backdrop-blur-customPinkButtonBGRGBA text-customSaturedPinkButtonText text-[16px] min-w-[250px] font-[500]"
          >
            Join as an Early Bird
          </button>
        </div>
      </div>
    </section>
  );
}
