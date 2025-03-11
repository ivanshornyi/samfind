import { Button } from "@/components";
import { Badge } from "@/components/ui/badge";
import { SoftwareImage } from "@public/home";
import Image from "next/image";

export const Software = () => {
  return (
    <div className="w-full flex flex-col items-center mt-[100px]">
      <Badge
        variant="secondary"
        className="bg-[#242424] rounded-3xl text-[#CE9DF3] py-[6px] px-6"
      >
        Software
      </Badge>
      <h2 className="text-center text-[40px] leading-[120%] font-semibold max-w-[996px] mt-6">
        Chat with your documents, generate content, and process information
        entirely on your local device without any data leaving your system.
      </h2>
      <h3 className="mt-6 font-normal text-base max-w-[538px] text-center">
        Available for both macOS and Windows, Onsio Desktop seamlessly
        integrates web search, AI chat, deep research capabilities, and advanced
        file analysis into an elegant native experience that respects your
        privacy at every level.
      </h3>
      <Image
        src={SoftwareImage}
        width={1008}
        height={722}
        className="mt-12"
        alt="mobile app image"
      />
      <Button variant="tetrary" className="px-8">
        Sign up and download
      </Button>
    </div>
  );
};
