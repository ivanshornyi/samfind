"use client";

import { oImage, OImage } from "@public/contact";
import { CheckmarkDonePinkSVG } from "@public/icons";
import Image from "next/image";

const ListDataMock: string[] = [
  "All the benefits of a monthly subscription",
  "Free access to our platform (web, mobile, desktop)",
  "The potential to sell shares later for profit",
  "Be part of the company’s growth",
];

export function InvestHero(): React.ReactNode {
  return (
    <section aria-label="investment-hero" className="sm:pt-[195px] relative">
      <div
        aria-label="wrapper"
        className="mx-auto flex sm:gap-[98px] gap-[32px] w-full max-w-[1160px] sm:flex-row flex-col"
      >
        <div className="flex flex-col gap-[32px] w-[592px] max-w-[592px]">
          <div className="flex gap-[3px] justify-start items-center">
            <p className="bg-customBlackTags text-customPinkSubText text-[14px] font-[500] py-[6.5px] px-[26.5px] rounded-[25px]">
              Invest & Grow
            </p>
          </div>
          <div className="flex flex-col gap-[32px]">
            <h1 className="text-[40px] sm:text-[96px] font-[800] sm:leading-[96px]">
              Early Bird Campaign
            </h1>
            <p className="text-customPinkSubText text-[20px] font-[600]">
              6 shares=1 months for free
            </p>
          </div>
          <div className="flex gap-[16px] items-center justify-start">
            <button
              aria-label="Early Bird campaign assignment"
              className="rounded-[30px] py-[8px] px-[32px] border border-customGreyButton bg-white backdrop-blur-customPinkButtonBGRGBA text-customSaturedPinkButtonText text-[16px] font-[500]"
            >
              Join as an Early Bird
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-[16px] w-[568px] max-w-[568px] justify-end">
          <h2 className="text-white sm:text-[20px] text-[16px] font-[500]">
            Exclusive perks for shareholders:
          </h2>
          <ul>
            {ListDataMock.map((item) => {
              return (
                <li
                  key={item}
                  className="flex gap-[20px] items-center text-white sm:text-[20px] text-[16px] font-[500]"
                >
                  <Image
                    src={CheckmarkDonePinkSVG}
                    alt="checkmark"
                    width={24}
                    height={24}
                  />
                  {item}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
