"use client";

import { Button } from "@/components/ui";
import Image from "next/image";
import { useEffect, useState } from "react";

export const Info = () => {
  const [scrolled, setScrolled] = useState(false);

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
      <h1 className="text-[48px] mt-[56px] leading-[65px] font-extrabold max-w-[1180px]">
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
