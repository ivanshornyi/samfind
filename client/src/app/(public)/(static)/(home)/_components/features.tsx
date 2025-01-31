import Image from "next/image";
import {
  OutlinePrivacyTip,
  ArrowGrowth,
  RoundCenterFocusStrong,
  ProiconsFile,
} from "@public/home";

const features = [
  {
    title: "PRIVATE & SECURE",
    description:
      "Your data, your control. Experience unmatched privacy in every interaction.",
    icon: OutlinePrivacyTip,
  },
  {
    title: "FLEXIBLE INTEGRATION",
    description:
      "Adapt and evolve with your growing needs. Choose what works best for you.",
    icon: ArrowGrowth,
  },
  {
    title: "POWERFUL PROCESSING",
    description:
      "Unleash the full potential of modern technology right at your fingertips.",
    icon: RoundCenterFocusStrong,
  },
  {
    title: "SMART FILE MANAGEMENT",
    description: "Effortless organization meets intelligent analysis.",
    icon: ProiconsFile,
  },
];

export const Features = () => {
  return (
    <div className="mt-20 sm:mt-[120px]">
      <h2 className="text-2xl lg:text-[40px] font-semibold mb-[30px] sm:mb-[50px]">
        Unlock Features
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[20px]">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`bg-card w-full h-[209px] sm:h-[317px] py-8 px-6 rounded-[20px] flex flex-col justify-between ${index % 2 === 0 ? "sm:mb-[113px]" : "sm:mt-[113px]"}`}
          >
            <div className="flex items-center gap-5">
              <Image src={feature.icon} width={24} height={24} alt="Icon" />
              <h3 className="text-[#CE9DF3] text-2xl font-bold">
                {feature.title}
              </h3>
            </div>
            <p className="font-medium text-xl">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
