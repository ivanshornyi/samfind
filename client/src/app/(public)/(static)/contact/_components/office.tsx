"use client";

import { Button } from "@/components/ui";
import { EllipseBlueImage } from "@public/contact";
import { Map } from "@public/contact/icons";
import Image from "next/image";

const contacts = [
  {
    name: "General:",
    value: "support@onsio.com",
    href: "mailto:support@onsio.com",
  },
  {
    name: "Technical:",
    value: "tech@onsio.com",
    href: "mailto:tech@onsio.com",
  },
  {
    name: "Enterprise:",
    value: "enterprise@onsio.com",
    href: "mailto:enterprise@onsio.com",
  },
];

export const Office = () => {
  const handleContactClick = () => {
    window.location.href = "mailto:support@onsio.com";
  };

  return (
    <div className="flex flex-col relative items-center justify-center ml-auto mr-auto font-manrope pt-[23px] sm:pt-[100px]">
      <div className="w-full flex justify-start sm:justify-end">
        <div className="w-full sm:w-[250px]">
          <div className="flex">
            <Image
              src={Map}
              width={24}
              height={24}
              alt="Map"
              className="w-[14px] h-[14px] sm:w-[24px] sm:h-[24px] mt-[3px] sm:mt-[10px] mr-4"
            />
            <p className="text-[16px] sm:text-[32px] leading-[22px] sm:leading-[44px] font-semibold">
              Office
            </p>
          </div>

          <p className="text-[10px] leading-[14px] sm:text-[16px] sm:leading-[22px]">
            Silicon Valley Innovation Center
          </p>
          <p className="text-[10px] leading-[14px] sm:text-[16px] sm:leading-[22px]">
            California, USA
          </p>
        </div>
      </div>
      <div className="mt-[100px] sm:mt-[-20px]">
        <Button
          className="text-[#8F40E5]"
          variant="tetrary"
          onClick={handleContactClick}
        >
          Contact
        </Button>
      </div>
      <h1 className="mt-[25px] text-[32px] sm:text-[48px] leading-[44px] sm:leading-[65px] text-center font-semibold">
        {`Let's solve challenges`} together:
      </h1>
      <h1 className="text-[32px] sm:text-[48px] leading-[44px] sm:leading-[65px] text-center font-semibold">
        together:
      </h1>
      <div className="mt-[25px] sm:mt-[42px] flex justify-evenly flex-col sm:flex-row w-full">
        {contacts.map((c) => (
          <div key={c.name} className="py-[32px] px-">
            <p className="text-[24px] text-link-hover leading-[24px] text-center uppercase">
              {c.name}
            </p>
            <a
              href={c.href}
              className="text-4 leading-4 sn:text-5 sm:leading-5 text-disabled mt-4 sam:mt-5 text-center block hover:underline"
            >
              {c.value}
            </a>
          </div>
        ))}
      </div>
      <Image
        src={EllipseBlueImage}
        width={1200}
        height={400}
        alt="Background illustration"
        className="absolute top-[280px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[-1]"
      />
    </div>
  );
};
