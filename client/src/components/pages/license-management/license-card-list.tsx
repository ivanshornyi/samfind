import React from "react";
import { LicenseCard } from "./license-card";
import {
  ActiveIcon,
  SettingsIcon,
  SupportIcon,
} from "@/../public/license-management";
import Image, { StaticImageData } from "next/image";

export type LicenseManagement = {
  id: number;
  title: string;
  description: string;
  actions: string[];
  icon: StaticImageData;
};

const cards: LicenseManagement[] = [
  {
    id: 1,
    title: "Active Licenses",
    description: "Stay in control of your subscriptions and payments.",
    actions: [
      "View and manage your subscription",
      "Access billing history",
      "Update payment details",
    ],
    icon: ActiveIcon,
  },
  {
    id: 2,

    title: "License Settings",
    description: "Tailor your license preferences to fit your needs.",
    actions: [
      "Manage preferences",
      "Configure access",
      "Update organization details",
    ],
    icon: SettingsIcon,
  },
  {
    id: 3,
    title: "Support Options",
    description: "Get help when you need it with top-tier support services.",
    actions: [
      "Access documentation",
      "Contact priority support",
      "Schedule consultations",
    ],
    icon: SupportIcon,
  },
];

export const LicenseCardList = () => {
  const starsImage = (
      <Image
        src="/license-management/stars.png"
        alt="icon"
        width={130}
        height={128}
      />
  );

  return (
    <div className="pt-[152px] md:pt-[200px] pb-[60px] md:pb-[120px]">
      <div className="w-fit rounded-3xl bg-[#242424] py-[6.4px] px-[25.6px] mb-6 mx-auto md:mx-[0]">
        <span className="font-medium text-base text-[#CE9DF3]">
          Explore more
        </span>
      </div>
      <h2 className="font-semibold text-3xl md:text-5xl text-[#ffffff] mb-[60px] md:mb-16 text-center md:text-start">
        License Management
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        {cards.map((card, index) => (
          <React.Fragment key={index}>
            {index === 2 ? (
              <div className="hidden md:flex items-center md:justify-start">{starsImage}</div>
            ) : null}
            <LicenseCard card={card} />
            {index === 2 ? <div className="md:hidden flex justify-end mt-14">{starsImage}</div> : null}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
