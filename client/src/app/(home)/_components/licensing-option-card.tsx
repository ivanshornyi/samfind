import { LicensingOptionType } from "@app/(home)/_lib";
import { Button } from "@/components/ui";
import { CheckOutline, DollarIcon } from "@public/home";
import Image from "next/image";

export const LicensingOptionCard = ({ option }: { option: LicensingOptionType }) => {
    return (
      <div className="w-full bg-card px-6 py-8 rounded-[20px]">
        <h3 className="font-semibold text-[32px] leading-[43px] mb-4">
          {option.title}
        </h3>
        <p className="font-normal text-base mb-10">{option.description}</p>
  
        {option.price ? (
          <div className="mb-10 flex gap-2">
            <div className="flex items-start justify-end">
              <Image src={DollarIcon} alt="dollar" width={23} height={49} />
            </div>
            <p className="font-semibold text-5xl text-[#DCDCDC] leading-[52px]">
              {option.price}
              <span className="text-[32px]">/month</span>
            </p>
          </div>
        ) : null}
  
        <Button
          variant={option.buttonVariant}
          className="w-full mb-10 border-none"
        >
          {option.buttonText}
        </Button>
        <ul className="space-y-[10px]">
          {option.features.map((feature, index) => (
            <li key={index} className="flex items-center gap-[20px]">
              <Image src={CheckOutline} width={24} height={24} alt="Checkmark" />
              <span className="font-normal text-xl">{feature}</span>
            </li>
          ))}
        </ul>
  
        {option.footerText ? (
          <div className="w-fit py-[6.4px] px-[25.61px] rounded-3xl bg-[#242424] mt-10">
            <span className="font-medium text-base text-[#CE9DF3]">
              {option.footerText}
            </span>
          </div>
        ) : null}
      </div>
    );
  };
  