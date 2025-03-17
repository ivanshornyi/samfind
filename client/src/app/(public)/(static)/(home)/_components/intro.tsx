import { Button } from "@/components/ui";
import { AuthContext } from "@/context";
import { HomeIntro, HomeIntroMobile } from "@public/home";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";

export const Intro = () => {
  const { user } = useContext(AuthContext);
  return (
    <div className="relative font-manrope h-[743px] sm:h-[824px] flex items-center justify-center">
      <div className="absolute sm:inset-0 flex flex-col items-center justify-center space-y-[83px] sm:space-y-8 text-center bottom-[8%]">
        <div className="space-y-4">
          <h1 className="text-start sm:text-center text-[40px] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold">
            Transform Your Digital <br className="hidden sm:block " />
            Experience with Onsio
          </h1>
          <div className="text-start sm:text-center text-[20px] ">
            Select early bird access and become an investor in a
            <br className="hidden sm:block " /> privacy-first AI platform.
          </div>
        </div>
        <div className="w-full sm:w-fit gap-[10px] sm:gap-0 flex flex-col sm:flex-row items-center">
          <Link href={user ? "/download-app" : "/auth/account-type"}>
            <Button
              variant="default"
              className="w-[361px] sm:w-[250px] h-[44px] rounded-[30px] text-xl font-medium text-[#8F40E5] border-[#A64CE8]"
            >
              Sign Up
            </Button>
          </Link>
          <Link href="/learn-more/mobile-app">
            <button className="w-[250px] h-[44px] flex justify-center items-center gap-[5px] text-xl font-medium">
              <span>Learn More</span>
            </button>
          </Link>
        </div>
      </div>
      {/* <Image
        src={HomeIntro}
        width={703}
        height={676}
        alt="Background illustration"
        className="hidden md:block absolute top-[45%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-[1]"
      /> */}
      <Image
        src={HomeIntroMobile}
        width={703}
        height={676}
        alt="Background illustration"
        className="md:hidden absolute top-[-7%] -left-5 right-0 -z-[1]"
      />
    </div>
  );
};
