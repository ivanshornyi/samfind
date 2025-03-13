import { Badge } from "@/components/ui/badge";
import { MobileAppImage } from "@public/home";
import Image from "next/image";

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
    </div>
  );
};
