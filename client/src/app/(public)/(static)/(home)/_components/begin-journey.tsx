import { Button } from "@/components/ui";
import { ArrowUpRight } from "@public/home";
import Image from "next/image";
import Link from "next/link";
// import { ArrowUpRight } from "@public/home";
// import Image from "next/image";

export const BeginJourney = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-[47px] mt-20 sm:mt-[120px] h-[460px] sm:h-[400px]">
      <div className="font-bold text-[32px] sm:text-[64px] leading-[32px] sm:leading-[64px] text-center mb-[100px] sm:mb-0">
        <h2>Begin Your Journey</h2>
        <h2>Today.</h2>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-[10px] sm:gap-0">
        <Link href="/download-app">
          <Button
            variant="secondary"
            className="w-[250px] h-[44px] rounded-[30px] text-xl font-medium border-[#A64CE8] py-6"
          >
            Download Now
          </Button>
        </Link>
        <Link href="/learn-more/software">
          <button className="w-[250px] h-[44px] flex justify-center items-center gap-[5px] text-2xl font-medium py-6">
            <span>Try Demo</span>{" "}
            <Image
              src={ArrowUpRight}
              width={43}
              height={43}
              alt="Arrow up right"
            />
          </button>
        </Link>
      </div>
    </div>
  );
};
