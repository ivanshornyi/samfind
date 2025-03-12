import { Badge } from "@/components/ui/badge";
import { WebPlatformImage } from "@public/home";
import Image from "next/image";

export const WebPlatform = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2  py-[48px] mt-[100px] gap-[48px]">
      <div className="flex flex-col gap-[48px] w-full max-w-[560px]">
        <Badge
          variant="secondary"
          className="bg-[#242424] w-fit rounded-3xl text-[#CE9DF3] py-[6px] px-6"
        >
          Web platform
        </Badge>
        <h2 className="text-[40px] leading-[120%] font-semibold">
          Core values: complete user anonymity, no data tracking, and
          open-source innovation.
        </h2>
        <h3 className="text-base font-normal">
          The platform leverages powerful language models: one efficient
          open-source model powers general conversational tasks, while another
          specialized model optimized for speed and reasoning handles complex
          queries and delivers rapid responses.
        </h3>
      </div>
      <Image
        src={WebPlatformImage}
        width={777}
        height={565}
        alt="web platform"
      />
    </div>
  );
};
