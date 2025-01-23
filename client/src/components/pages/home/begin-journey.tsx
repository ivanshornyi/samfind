import { Button } from "@/components/ui";
import { ArrowUpRight } from "@public/home";
import Image from "next/image";

export const BeginJourney = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-[47px] mt-20 sm:mt-[120px]">
      <div className="font-bold text-[32px] sm:text-[64px] leading-[32px] sm:leading-[64px] text-center">
        <h2>Begin Your Journey</h2>
        <h2>Today.</h2>
      </div>
      <div className="flex flex-col sm:flex-row items-center">
        <Button
          variant="secondary"
          className="w-[250px] h-[44px] rounded-[30px] text-xl font-medium border-[#A64CE8]"
        >
          Download Now
        </Button>
        <button className="w-[250px] h-[44px] flex justify-center items-center gap-[5px] text-2xl font-medium">
          <span>Try Demo</span>{" "}
          <Image
            src={ArrowUpRight}
            width={43}
            height={43}
            alt="Arrow up right"
          />
        </button>
      </div>
    </div>
  );
};
