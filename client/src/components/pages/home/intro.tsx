import { Button } from "@/components/ui";
import { ArrowUpRight, HomeIntro, HomeIntroMobile } from "@public/home";
import Image from "next/image";

export const Intro = () => {
  return (
    <>
      <div className="relative font-manrope h-[743px] sm:h-[824px] flex items-center justify-center">
        <div className="absolute sm:inset-0 flex flex-col items-center justify-center space-y-[83px] sm:space-y-8 text-center bottom-[8%]">
          <div className="space-y-4">
            <h1 className="text-start sm:text-center text-[40px] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold">
              Transform Your Digital <br className="hidden sm:block" />
              Experience with Onsio
            </h1>
          </div>
          {/* <div className="absolute top-[29%] left-[75%] transform -translate-x-1/2 -translate-y-1/2 font-semibold text-base text-start">
              <h2>Experience unmatched privacy in</h2>
              <h2>every interaction.</h2>
            </div> */}
          <div className="w-full sm:w-fit gap-[10px] sm:gap-0 flex flex-col sm:flex-row items-center">
            <Button
              variant="default"
              className="w-full sm:w-[250px] h-[44px] rounded-[30px] text-xl font-medium text-[#8F40E5] border-[#A64CE8]"
            >
              Download Now
            </Button>
            <button className="w-[250px] h-[44px] flex justify-center items-center gap-[5px] text-2xl font-medium">
              <span>Try Demo</span>
              <Image
                src={ArrowUpRight}
                width={43}
                height={43}
                alt="Arrow up right"
              />
            </button>
          </div>
        </div>
        <Image
          src={HomeIntro}
          width={703}
          height={676}
          alt="Background illustration"
          className="hidden md:block absolute top-[45%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-[1]"
        />
        <Image
          src={HomeIntroMobile}
          width={703}
          height={676}
          alt="Background illustration"
          className="md:hidden absolute top-[-7%] -left-5 right-0 -z-[1]"
        />
      </div>
      <div className="space-y-[7px] text-center [&>h3]:font-medium [&>h3]:text-[20px] sm:[&>h3]:text-[32px] [&>h3]:leading-[27px] sm:[&>h3]:leading-[43px] [&>h3]:text-[#616161]">
        <h2 className="font-semibold text-2xl sm:text-[40px] leading-[32px] sm:leading-[54px]">
          Seamless Integration
        </h2>
        <h3>Enhanced Privacy</h3>
        <h3>Smart Solutions</h3>
      </div>
    </>
  );
};
