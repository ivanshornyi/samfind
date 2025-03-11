import { Button } from "@/components/ui";
import Link from "next/link";

export const BeginJourney = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-[61px] mt-20 sm:mt-[120px] h-[460px] sm:h-[400px]">
      <div className="font-bold text-[32px] sm:text-[64px] leading-[32px] sm:leading-[64px] text-center mb-[100px] sm:mb-0">
        <h2>Begin Your Journey</h2>
        <h2>Today.</h2>
      </div>
      <Link href="/download-app">
        <Button
          variant="secondary"
          className="w-[250px] h-[44px] rounded-[30px] text-xl font-medium border-[#A64CE8] py-6"
        >
          Sign Up
        </Button>
      </Link>
    </div>
  );
};
