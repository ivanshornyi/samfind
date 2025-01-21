"use client";

import { Button, Input } from "@/components/ui";

export const Questions = () => {
  return (
    <div className="flex flex-col items-center justify-center ml-auto mr-auto font-manrope pt-[100px] sm:pt-[200px] mb-[60px] sm:mb-[100px]">
      <div>
        <Button className="text-[#8F40E5]" variant="tetrary">
          Contact us
        </Button>
      </div>

      <h1 className="mt-[25px] text-[32px] sm:text-[48px] leading-[44px] sm:leading-[65px] font-semibold">
        Frequently Asked questions
      </h1>
      <p className="mt-[25px] text-[20px] leading-[27px] text-center">
        Need help with something? Here are our most frequently asked questions
      </p>
      <form className="flex space-x-2 mt-[25px] w-full sm:w-[350px] relative">
        <Input type="text" placeholder="Search" />
        <div className="absolute right-0 top-[2px]">
          <Button
            type="submit"
            variant="secondary"
            icon="right"
            className="w-5"
          ></Button>
        </div>
      </form>
    </div>
  );
};
