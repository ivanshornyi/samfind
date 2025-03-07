'use client'

import { CheckmarkDonePinkSVG } from "@public/icons"
import { ArrowUpRight } from "lucide-react"
import Image from "next/image"

interface Props {
  //
}

const ListDataMock: string[] = [
  'All the benefits of a monthly subscription',
  'Free access to our platform (web, mobile, desktop)',
  'The potential to sell shares later for profit',
  'Be part of the company’s growth'
]

export function InvestHero({ }: Props): React.ReactNode {
  return (
    <section aria-label="investment-hero" className="pt-[195px]">
      <div aria-label="wrapper" className="mx-auto flex gap-[98px] w-full max-w-[1160px]">
        <div className="flex flex-col gap-[32px] w-[592px] max-w-[592px]">
          <div className="flex gap-[3px] justify-start items-center">
            <p className="bg-customBlackTags text-customPinkSubText text-[14px] font-[500] py-[6.5px] px-[26.5px] rounded-[25px]">Invest & Grow</p>
            <p className="bg-customBlackTags text-customPinkSubText text-[14px] font-[500] py-[6.5px] px-[26.5px] rounded-[25px]">Get 10% Off – Join Early</p>
          </div>
          <div className="flex flex-col gap-[32px]">
            <h1 className="text-white text-[96px] font-[800] leading-[96px]">Early Bird Campaign</h1>
            <p className="text-customPinkSubText text-[32px] font-[600]">6 shares=1 months for free</p>
          </div>
          <div className="flex gap-[16px] items-center justify-start">
            <button
              aria-label="Early Bird campaign assignment"
              className="rounded-[30px] py-[8px] px-[32px] border border-customGreyButton bg-white backdrop-blur-customPinkButtonBGRGBA text-customSaturedPinkButtonText text-[16px] font-[500]"
            >
              Join as an Early Bird
            </button>
            <button
              className="text-white text-[16px] font-[500] flex gap-[8px] items-center"
            >
              Become a Key Investor
              <ArrowUpRight className="w-[30px] h-[30px]" />
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-[16px] w-[568px] max-w-[568px] justify-end">
          <h2 className="text-white text-[20px] font-[500]">Exclusive perks for shareholders:</h2>
          <ul>
            {ListDataMock.map((item) => {
              return (
                <li
                  key={item}
                  className="flex gap-[20px] items-center text-white text-[20px] font-[500]"
                >
                  <Image
                    src={CheckmarkDonePinkSVG}
                    alt="checkmark"
                    width={24}
                    height={24}
                  /> {item}
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
