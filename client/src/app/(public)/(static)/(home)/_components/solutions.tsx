import { Button } from "@/components";
import { SolutionsImage } from "@public/home";
import Image from "next/image";

export const Solutoins = () => {
  return (
    <div
      className="items-center gap-[100px] grid grid-cols-1 sm:grid-cols-2 "
      id="solution"
    >
      <Image src={SolutionsImage} width={600} height={763} alt="solutoins" />
      <div className="flex flex-col">
        <h2 className="font-bold sm:text-[40px] text-[24px] leading-[120%]">
          Whether you’re an individual or a business, Onsio empowers you with
          smart, privacy-first solutions for navigating the digital world.
        </h2>
        <h3 className="font-normal text-base mt-6">
          We believe that privacy shouldn’t come at the cost of powerful,
          intelligent tools. Onsio is your trusted partner in unlocking new
          possibilities for research, content generation, and data management,
          all while protecting your digital identity.
        </h3>
        <div className="flex sm:flex-row flex-row-reverse sm:flex items-center gap-[6px] mt-[48px] text[16px] ">
          <Button
            variant="secondary"
            className="w-full max-w-[200px] min-w-[177px]"
          >
            Sign up
          </Button>
          <button
            className="max-w-[200px] min-w-[177px] h-[44px] flex justify-center items-center gap-[5px] text-[16px] font-medium"
            onClick={() => {
              document
                .getElementById("feature")
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
