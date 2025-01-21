import { Button } from "@/components/ui";
import Image from "next/image";

export const Info = () => {
  return (
    <div className="relative font-manrope h-[824px] pt-[150px]">
      <Image
        src="/about/ellipse-blue.png"
        width={450}
        height={1200}
        alt="Background illustration"
        className="absolute top-[50px] left-0 z-[-1]"
      />
      <p className="w-[333px] font-semibold text-base mb-[56px]">
        Empowering individuals and organizations to achieve more through
        cutting-edge technology.
      </p>
      <Button variant="link" icon>
        Contact us
      </Button>
      <h1 className="text-[96px] mt-[56px] leading-[96px] font-extrabold">
        Transform Your Digital
      </h1>
    </div>
  );
};
