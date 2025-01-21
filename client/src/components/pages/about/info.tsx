// import { Button } from "@/components/ui";
import { Button } from "@/components/ui";
import Image from "next/image";

export const Info = () => {
  return (
    <div className="relative font-manrope h-[824px] pt-[150px]">
      <Image
        src="/about/ellipse-blue.png"
        width={301}
        height={827}
        alt="Background illustration"
        className="absolute top-[102px] left-0"
      />
      <p className="w-[333px] font-semibold text-base mb-10">
        Empowering individuals and organizations to achieve more through
        cutting-edge technology.
      </p>
      {/* <button className="h-[60px] mt-[56px] cursor-pointer flex justify-center items-center gap-[5px] text-2xl font-medium">
        <span
          style={{
            textDecorationLine: "underline",
            textDecorationStyle: "wavy",
            textUnderlineOffset: "6px",
          }}
        >
          Contact us
        </span>
      </button> */}
      <Button>Contact us</Button>
    </div>
  );
};
