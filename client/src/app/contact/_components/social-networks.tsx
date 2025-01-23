"use client";

import Image from "next/image";
import { LinkedIn, GitHub, Twitter } from "@public/contact/icons";
import { NetworkItem } from "./network-item";
import { EllispeRedImage } from "@public/contact";

const networks = [
  {
    name: "Twitter:",
    icon: Twitter,
    text: "@OnsioTech",
    link: "https://x.com/OnsioAI",
  },
  {
    name: "LinkedIn:",
    icon: LinkedIn,
    text: "Onsio Technologies",
    link: "https://linkedin.com/company/onsio/about",
  },
  {
    name: "GitHub:",
    icon: GitHub,
    text: "github.com/onsio",
    link: "https://github.com/onsio",
  },
];

export const SocialNetworks = () => {
  return (
    <div className="relative overflow-hidden flex flex-col sm:flex-row mt-[60px] mb-[60px] sm:mb-[680px] justify-evenly align-center pt-[100px] pb-[32px] sm:py-[87px] rounded-[20px] bg-[#262525]">
      <div className="z-10 mt-4">
        <h2 className="font-semibold text-[32px] leading-[43px] w-full sm:max-w-[334px] text-center sm:text-start">
          Connect With Us
        </h2>
        <p className="text-[16px] leading-[22px] mt-4 text-center sm:text-start">
          Join our growing community:
        </p>
      </div>
      <div className="z-10 mt-[94px] sm:mt-0 grid grid-cols-2 sm:gap-x-10 max-w-[390px] sm:max-w-full ml-auto mr-auto sm:mx-0">
        {networks.map((n) => (
          <NetworkItem
            key={n.name}
            name={n.name}
            icon={n.icon}
            text={n.text}
            link={n.link}
          />
        ))}
      </div>
      <Image
        src={EllispeRedImage}
        width={1200}
        height={400}
        alt="Background illustration"
        className="absolute top-[30%] sm:top-[50%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[-0]"
      />
    </div>
  );
};
