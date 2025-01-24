import React from "react";
import { LicenseCard } from "./license-card";
import { EllipseBlueImage, StarsImage } from "@public/license-management";
import Image from "next/image";
import { LicenseManagementConstants } from "../_lib";

export const LicenseCardList = () => {
  const starsImage = (
    <Image src={StarsImage} alt="icon" width={130} height={128} />
  );

  return (
    <div className="pt-[152px] md:pt-[200px] pb-[60px] md:pb-[120px]">
      <div className="w-fit rounded-3xl bg-[#242424] py-[6.4px] px-[25.6px] mb-6 mx-auto md:mx-[0] relative">
        <span className="font-medium text-base text-[#CE9DF3]">
          Explore more
        </span>
      </div>
      <h2 className="font-semibold text-3xl md:text-5xl text-[#ffffff] mb-[60px] md:mb-16 text-center md:text-start">
        License Management
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        {LicenseManagementConstants.map((card, index) => (
          <React.Fragment key={index}>
            {index === 2 ? (
              <div className="hidden md:flex items-center md:justify-start">
                {starsImage}
              </div>
            ) : null}
            <LicenseCard card={card} />
            {index === 2 ? (
              <div className="md:hidden flex justify-end mt-14">
                {starsImage}
              </div>
            ) : null}
          </React.Fragment>
        ))}
      </div>
      <Image
        src={EllipseBlueImage}
        width={412}
        height={200}
        alt="Background illustration"
        className="absolute top-[28px] left-0 z-[-1]"
      />
    </div>
  );
};
