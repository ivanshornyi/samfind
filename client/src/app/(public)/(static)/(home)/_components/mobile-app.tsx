import { Button } from "@/components/ui";
import { Badge } from "@/components/ui/badge";
import { MobileAppImage } from "@public/home";
import Image from "next/image";
import Link from "next/link";

export const MobileApp = () => {
  return (
    <div className="w-full flex flex-col items-center mt-[100px]">
      <Badge
        variant="secondary"
        className="bg-[#242424] rounded-3xl text-[#CE9DF3] py-[6px] px-6"
      >
        Mobile app
      </Badge>
      <h2 className="text-center text-[40px] leading-[120%] font-semibold max-w-[996px] mt-6">
        Complete digital privacy—all from a sleek, responsive mobile interface.
        Private AI in your pocket.
      </h2>
      <Image
        src={MobileAppImage}
        width={900}
        height={700}
        className="mt-12"
        alt="mobile app image"
      />
      <div className="flex sm:flex-row flex-row-reverse sm:flex items-center gap-[6px] mt-[48px]">
        <Button
          variant="secondary"
          className="w-full max-w-[200px] min-w-[177px]"
        >
          Sign up and download
        </Button>
        <Link href="/learn-more/mobile-app">
          <button className="text-[16px] max-w-[200px] min-w-[125px] h-[44px] flex justify-center items-center gap-[5px] text-xl font-medium">
            <span>Learn More</span>
          </button>
        </Link>
      </div>
    </div>
  );
};
