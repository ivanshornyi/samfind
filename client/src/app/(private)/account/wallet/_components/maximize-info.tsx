import EllipseVioletImage from "@public/wallet-info-bg.png";
import { ChevronsRight } from "lucide-react";
import Image from "next/image";

export const MaximizeInfo = () => {
  return (
    <div className="flex p-0 flex-col justify-center items-center rounded-2xl relative w-full h-[171px] bg-[#242424] gap-5 px-6">
      <div className="text-[#CE9DF3] text-[20px] leading-[27px] font-semibold flex z-10">
        <div className="flex pt-[2px]">
          <ChevronsRight />
          <ChevronsRight className="ml-[-10px]" />
        </div>

        <span>Maximize Your Wallet!</span>
      </div>
      <h2 className="text-[20px] text-center leading-[27px] font-bold z-10">
        Buy Shares & Become a Part of Our Success
      </h2>
      <p className="ext-[16px] leading-[22px] z-10 text-center">
        Invest in Onsio Shares & Grow with Us
      </p>
      <Image
        src={EllipseVioletImage}
        layout="fill"
        objectFit="cover"
        alt="Background illustration"
        className="absolute top-0 left-0 w-full h-full"
      />
    </div>
  );
};
