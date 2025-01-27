"use client";

import { Button } from "@/components/ui";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { EllipseBlueImage } from "@public/about";
import { MoveUpRight } from "lucide-react";

export const Info = () => {
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 200) {
        setScrolled(true);
      }
    }

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative font-manrope pt-[100px] sm:pt-[150px] mb-[70px] sm:mb-[172px]">
      <Image
        src={EllipseBlueImage}
        width={450}
        height={1200}
        alt="Background illustration"
        className="absolute top-[50px] left-0 z-[-1]"
      />
      <p className="w-full max-w-[333px] font-semibold text-base mb-[27px] sm:mb-[56px]">
        Empowering individuals and organizations to achieve more through
        cutting-edge technology.
      </p>
      <Button
        variant="link"
        rightIcon={<MoveUpRight style={{ width: "20px", height: "20px" }} />}
        onClick={() => router.push("/contact")}
      >
        Contact us
      </Button>
      <h1 className="text-[32px] sm:text-[48px] mt-[56px] leading-[44px] sm:leading-[65px] font-extrabold max-w-[1180px]">
        <span>
          {`In Osio we're dedicated to creating solutions that respect privacy`}
        </span>
        {"  "}
        <span
          className={scrolled ? "" : "text-disabled"}
        >{`while pushing the boundaries of what's possible.`}</span>
      </h1>
    </div>
  );
};
