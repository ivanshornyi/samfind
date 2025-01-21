import { Button } from "@/components/ui";
import Image from "next/image";

type LicensingOption = {
  id: number;
  title: string;
  description: string;
  price?: string;
  buttonText: string;
  buttonVariant: "default" | "secondary";
  features: string[];
  footerText?: string;
  isPremium: boolean;
};

const licensingOptions: LicensingOption[] = [
  {
    id: 1,
    title: "Freemium",
    description: "Essential features for personal and community use",
    price: undefined,
    buttonText: "Get Started Free",
    buttonVariant: "secondary",
    features: ["Essential features", "Community access", "Basic support"],
    footerText: "Community Edition",
    isPremium: false,
  },
  {
    id: 2,
    title: "Standart",
    description:
      "Boost your capabilities with premium features and priority support.",
    price: "19.99/month",
    buttonText: "Buy Professional",
    buttonVariant: "default",
    features: ["Enhanced capabilities", "Priority updates", "Premium support"],
    footerText: undefined,
    isPremium: true,
  },
];

export const LicensingOptions = () => {
  return (
    <div className="mt-[120px] mb-20">
      <div className="mb-[50px] flex items-center justify-between">
        <h2 className="text-[40px] font-semibold ">Licensing Options</h2>
        <span className="font-medium text-xl">
          Adapt and evolve with your growing needs. Choose what <br /> works
          best for you.
        </span>
      </div>

      <div className="flex gap-5">
        {licensingOptions.map((option) => (
          <div
            key={option.id}
            className="w-full bg-card px-6 py-8 rounded-[20px]"
          >
            <h3 className="font-semibold text-[32px] leading-[43px] mb-4">
              {option.title}
            </h3>
            <p className="font-normal text-base mb-10">{option.description}</p>

            {option.price ? (
              <div className="mb-10 flex gap-2">
                <div className="flex items-start">
                  <Image
                    src="home/icons/dollar.svg"
                    alt="dollar"
                    width={23}
                    height={49}
                  />
                </div>
                <span className="font-semibold text-5xl text-[#DCDCDC] leading-[52px]">
                  {option.price}
                </span>
              </div>
            ) : null}

            <Button
              variant={option.buttonVariant}
              className="w-full mb-10 py-[22px] border-none"
            >
              {option.buttonText}
            </Button>
            <ul className="space-y-[10px]">
              {option.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-[20px]">
                  <Image
                    src="home/icons/check-outline.svg"
                    width={24}
                    height={24}
                    alt="Checkmark"
                  />
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
        ))}
      </div>
    </div>
  );
};
