"use client";

import { oImage, OImage } from "@public/contact";
import { CheckmarkDonePinkSVG } from "@public/icons";
import Image from "next/image";
import Link from "next/link";

const ListDataMock: string[] = [
  "All the benefits of a monthly subscription",
  "Free access to our platform (web, mobile, desktop)",
  "The potential to sell shares later for profit",
  "Be part of the company’s growth",
];

export function InvestHero(): React.ReactNode {
  return (
    <section
      aria-label="investment-hero"
      className="sm:pt-[195px] pt-[60px] relative "
    >
      <div
        aria-label="wrapper"
        className="mx-auto flex sm:gap-[98px] gap-[32px] w-full sm:max-w-[1160px] sm:flex-row flex-col"
      >
        <div className="flex flex-col gap-[32px] max-w-[592px]">
          <div className="flex gap-[3px] justify-start items-center">
            <p className="bg-customBlackTags text-customPinkSubText text-[14px] font-[500] py-[6.5px] px-[26.5px] rounded-[25px]">
              Invest & Grow
            </p>
          </div>
          <div className="flex flex-col gap-[32px]">
            <h1 className="text-[40px] sm:text-[96px] sm:max-w-[492px] max-w-[360px] font-[800] sm:leading-[96px]">
              Early Bird Campaign
            </h1>
            <p className="text-customPinkSubText sm:text-[20px] text-[16px] font-[600]">
              6 shares=1 months for free
            </p>
          </div>
          <div className="hidden sm:block gap-[16px] items-center justify-start ">
            <Link href={"/account/billing-data"}>
              <button
                aria-label="Early Bird campaign assignment"
                className="rounded-[30px] py-[8px] px-[32px] border border-customGreyButton bg-white backdrop-blur-customPinkButtonBGRGBA text-customSaturedPinkButtonText text-[16px] font-[500]"
              >
                Join as an Early Bird
              </button>
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-[16px] max-w-[360px] sm:max-w-[568px] justify-end">
          <h2 className="text-white sm:text-[20px] text-[16px] font-[500]">
            Exclusive perks for shareholders:
          </h2>
          <ul className="flex flex-col gap-[16px]">
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
                  <span>{item}</span>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="flex justify-center">
          <Link href={"/account/billing-data"}>
            <button
              aria-label="Early Bird campaign assignment"
              className="sm:hidden rounded-[30px] max-w-[250px] py-[8px] px-[32px] border border-customGreyButton bg-white backdrop-blur-customPinkButtonBGRGBA text-customSaturedPinkButtonText text-[16px] font-[500]"
            >
              Join as an Early Bird
            </button>
          </Link>
        </div>
      </div>

      <Image
        src={OImage}
        width={750}
        height={200}
        alt="Background illustration"
        className="absolute z-[-100] top-[-100px] right-[-100px] overflow-hidden hidden sm:block"
      />
      <Image
        src={oImage}
        width={250}
        height={200}
        alt="Background illustration"
        className="absolute z-[-100] top-[-100px] right-[-16px] overflow-hidden block sm:hidden"
      />
    </section>
  );
}
