import { Button } from "@/components";
import Image from "next/image";
import React from "react";
import { BeginJourneyBgImage, ArrowToChatImage } from "@public/home";

export const Support = () => {
  return (
    <div>
      <div className="bg-[#28282C] bg-opacity-70 backdrop-blur-xs flex flex-col items-center justify-center ml-auto mr-auto font-manrope gap-[40px] min-w-[361px] h-[670px] rounded-[20px] ">
        <p className="text-[#CE9DF3] text-[16px] bg-[#242424] w-[113px] h-[34px] flex justify-center rounded-xl">
          Support
        </p>
        <p className="flex text-[48px] text-center justify-center">
          Need help with <br className="sm:hidden" />
          something?
        </p>
        <p className="text-center sm:text-[20px] text-[16px] max-w-[490px]">
          Our AI-powered chatbot is here 24/7 to <br className="sm:hidden" />
          answer all your questions.
        </p>
        <div>
          <Button className="bg-[#363637] backdrop-blur-[28.2px] text-white text-[16px] w-[192px] h-[44px] border-[1px] rounded-[30px]">
            Just chat with us
          </Button>
        </div>
        <div className="flex md:flex-row flex-col text-[14px] sm:text-[16px] justify-between text-[#A8A8A8] md:max-w-[660px] gap-[32px] text-center">
          <p>
            Get quick responses without waiting. <br /> Our bot will walk you
            through any issue.
          </p>
          <p className="relative">
            Start Chatting Now! <br />
            Tap the chat icon to get instant help.
            <Image
              src={ArrowToChatImage}
              alt="arrow to help"
              className="absolute left-[80%] top-[20%] rotate-[23deg] w-[37%] sm:w-[60%] sm:left-[120%] sm:top-[-50%] sm:rotate-[0deg]"
            />
          </p>
        </div>
        <Image
          src={BeginJourneyBgImage}
          width={1396}
          height={700}
          alt="begin journey background image"
          className="absolute z-[-1]"
        />
      </div>
    </div>
  );
};
