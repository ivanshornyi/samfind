import Image from "next/image";
import {
  Search,
  Chat,
  InternalSearch,
  OfflineChat,
  DeepResearch,
} from "@public/home";
import { Button } from "@/components";
import { ComingSoon } from "@public/icons";

const features = [
  {
    id: 1,
    title: "File search",
    description:
      "Conduct in-depth research with comprehensive results from multiple sources.",
    category: "Local file search",
    icon: Search,
  },
  {
    id: 2,
    title: "AI Chat",
    description:
      "Get assistance with tasks, content generation, and complex queries through a secure chat.",
    category: "Advanced online Chat",
    icon: Chat,
  },
  {
    id: 3,
    title: "Web Search",
    description:
      "AI boosted Internet Search, find relevant and private information without tracking.",
    category: "Internet Search",
    icon: InternalSearch,
  },
  {
    id: 4,
    title: "Offline AI chat",
    description:
      "Get assistance with tasks, content generation, and complex queries through a secure chat.",
    category: "Offline chat",
    icon: OfflineChat,
  },
  {
    id: 5,
    title: "Deep research",
    description:
      "Conduct in-depth research with comprehensive results from multiple sources.",
    category: "Deep research",
    icon: DeepResearch,
    badge: true,
  },
];

export const Features = () => {
  return (
    <div className="mt-20 sm:mt-[120px] mx-auto" id="feature">
      <h2 className="text-[#CE9DF3] text-xl mb-6 font-semibold">
        Access to Feature
      </h2>
      <h3 className="text-2xl lg:text-[40px] lg:leading-[120%] font-semibold mb-[30px] sm:mb-[48px]">
        Onsio is your trusted partner in unlocking new possibilities for
        research, content generation, and data management, all while protecting
        your digital identity.
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-[20px]">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`bg-card w-full py-8 px-6 rounded-[20px] flex flex-col justify-between"}`}
          >
            <div
              className={`${feature.badge ? "flex flex-row justify-between" : ""}`}
            >
              <div className="flex justify-center py-2 items-center rounded-3xl border-solid border-2 border-[#363637] gap-[6px] mb-8">
                <Image src={feature.icon} width={24} height={24} alt="Icon" />
                <h4 className="text-[#CE9DF3] text-sm font-medium">
                  {feature.category}
                </h4>
              </div>
              <div
                className={`${feature.badge ? "" : "hidden"} bg-gradient-to-r from-[#12093109] to-[#351B93] h-[40px] w-[157px] text-center text-[15px] rounded-[30px] py-[8px] px-[16px] flex flex-row gap-[4px]`}
              >
                <Image src={ComingSoon} alt="Coming Soon" />
                Coming Soon
              </div>
            </div>
            <h3 className="text-3xl font-semibold mb-6">{feature.title}</h3>
            <p className="font-normal text-base">{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="flex sm:flex-row flex-row-reverse items-center justify-center gap-2 mt-[48px] text[16px] ">
        <Button className="w-full max-w-[200px]" variant="secondary">
          Sign Up
        </Button>
        <div className="w-full max-w-[200px] flex justify-center">
          <button
            className="flex justify-center items-center gap-[5px] text[16px] font-medium"
            onClick={() => {
              document
                .getElementById("mobile")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <span>Learn More</span>
          </button>
        </div>
      </div>
    </div>
  );
};
