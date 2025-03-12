import { Button } from "@/components/ui";
import { AuthContext } from "@/context";
import Link from "next/link";
import { useContext } from "react";
import Image from "next/image";
import { BeginJourneyBgImage } from "@public/home";

export const BeginJourney = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="flex flex-col relative items-center justify-center space-y-[61px] mt-20 sm:mt-[120px] h-[460px] sm:h-[400px]">
      <div className="font-bold text-[32px] sm:text-[64px] leading-[32px] sm:leading-[64px] text-center mb-[100px] sm:mb-0">
        <h2>Begin Your Journey</h2>
        <h2>Today.</h2>
      </div>
      <Link href={user ? "/download-app" : "/auth/account-type"}>
        <Button
          variant="default"
          className="w-full sm:w-[250px] h-[44px] rounded-[30px] text-xl font-medium text-[#8F40E5] border-[#A64CE8]"
        >
          Sign Up
        </Button>
      </Link>
      <Image
        src={BeginJourneyBgImage}
        width={1150}
        height={652}
        alt="begin journey background image"
        className="absolute -top-[212px] z-[-1]"
      />
    </div>
  );
};
