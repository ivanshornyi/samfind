import React from "react";

import Link from "next/link";

import { Button } from "@/components";

interface PageDescriptionProps {
  title: string;
  description: string;
}

export const PageDescription: React.FC<PageDescriptionProps> = ({ title, description }) => {
  return (
    <div 
      className="
        py-[70px] flex flex-col gap-8 items-center 
        justify-center px-5 md:py-[150px]
      "
    >
      <Link
        href="/"
      >
        <Button variant="tetrary" className="text-violet-50">Learn more</Button>
      </Link>
      <div>
        <h1 className="text-center text-[48px] font-semibold">{title}</h1>
        <p className="text-center w-full text-xl md:w-[800px]">
          {description}
        </p>
      </div>
      <Link href="/download-app">
        <Button
          className="w-[250px]"
        >
          Download App
        </Button>
      </Link>
    </div>
  );
}