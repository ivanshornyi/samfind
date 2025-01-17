"use client";

import { Button } from "@/components";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

const features = [
  {
    title: "PRIVATE & SECURE",
    description:
      "Your data, your control. Experience unmatched privacy in every interaction.",
  },
  {
    title: "FLEXIBLE INTEGRATION",
    description:
      "Adapt and evolve with your growing needs. Choose what works best for you.",
  },
  {
    title: "POWERFUL PROCESSING",
    description:
      "Unleash the full potential of modern technology right at your fingertips.",
  },
  {
    title: "SMART FILE MANAGEMENT",
    description: "Effortless organization meets intelligent analysis.",
  },
];

const renderBeginBtns = () => (
  <div className="flex items-center">
    <Button
      variant="default"
      className="w-[250px] h-[44px] rounded-[30px] text-xl font-medium text-[#8F40E5]"
    >
      Download Now
    </Button>
    <button className="w-[250px] h-[44px] flex justify-center items-center gap-[5px] text-2xl font-medium">
      <span>Try Demo</span> <ArrowUpRight size="30px" />
    </button>
  </div>
);

export default function Main() {
  return (
    <>
      <Intro />
      <Features />
      <Begin />
    </>
  );
}

function Intro() {
  return (
    <>
      <div className="relative font-manrope h-[824px] flex items-center justify-center">
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-[96px] leading-[96px] font-extrabold">
              Transform Your Digital
            </h1>
            <h1 className="text-[96px] leading-[96px] font-extrabold">
              Experience with Onsio
            </h1>
          </div>
          {/* <div className="absolute top-[29%] left-[75%] transform -translate-x-1/2 -translate-y-1/2 font-semibold text-base text-start">
      <h2>Experience unmatched privacy in</h2>
      <h2>every interaction.</h2>
    </div> */}
          <div className="flex items-center">
            <Button
              variant="default"
              className="w-[250px] h-[44px] rounded-[30px] text-xl font-medium text-[#8F40E5]"
            >
              Download Now
            </Button>
            <button className="w-[250px] h-[44px] flex justify-center items-center gap-[5px] text-2xl font-medium">
              <span>Try Demo</span> <ArrowUpRight size="30px" />
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
      <div className="space-y-[7px] text-center [&>h3]:font-medium [&>h3]:text-[32px] [&>h3]:leading-[43px] [&>h3]:text-[#616161]">
        <h2 className="font-semibold text-[40px] leading-[54px]">
          Seamless Integration
        </h2>
        <h3>Enhanced Privacy</h3>
        <h3>Smart Solutions</h3>
      </div>
    </>
  );
}

function Features() {
  return (
    <div className="mt-[120px]">
      <h2 className="text-[40px] font-semibold mb-[50px]">Unlock Features</h2>

      <div className="flex gap-[20px]">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-[#28282C] py-8 px-6 rounded-[20px] h-[317px] flex flex-col justify-between"
          >
            <h3 className="text-[#CE9DF3] text-2xl font-bold">
              {feature.title}
            </h3>
            <p className="font-medium text-xl">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Begin() {
  return (
    <div className="flex flex-col items-center justify-center space-y-[47px] my-[120px]">
      <div className="font-bold text-[64px] leading-[64px] text-center">
        <h2>Begin Your Journey</h2>
        <h2>Today.</h2>
      </div>
      <div className="flex">{renderBeginBtns()}</div>
    </div>
  );
}
