import { Button } from "@/components/ui";
import Image from "next/image";

export const Intro = () => {
  return (
    <>
      <div className="relative font-manrope h-[824px] flex items-center justify-center">
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-[40px] sm:text-[96px] leading-[48px] sm:leading-[96px] font-extrabold">
              Transform Your Digital
            </h1>
            <h1 className="text-[40px] sm:text-[96px] leading-[48px] sm:leading-[96px] font-extrabold">
              Experience with Onsio
            </h1>
          </div>
          {/* <div className="absolute top-[29%] left-[75%] transform -translate-x-1/2 -translate-y-1/2 font-semibold text-base text-start">
              <h2>Experience unmatched privacy in</h2>
              <h2>every interaction.</h2>
            </div> */}
          <div className="flex flex-col sm:flex-row items-center">
            <Button
              variant="default"
              className="w-[250px] h-[44px] rounded-[30px] text-xl font-medium text-[#8F40E5] border-[#A64CE8]"
            >
              Download Now
            </Button>
            <button className="w-[250px] h-[44px] flex justify-center items-center gap-[5px] text-2xl font-medium">
              <span>Try Demo</span>
              <Image
                src="home/icons/arrow-up-right.svg"
                width={43}
                height={43}
                alt="Arrow up right"
              />
            </button>
          </div>
        </div>
        <Image
          src="/home/intro.png"
          width={703}
          height={676}
          alt="Background illustration"
          className="absolute top-[45%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-[1]"
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
