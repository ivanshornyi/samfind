"use client";

import Image from "next/image";

interface NetworkItemProps {
  name: string;
  icon: string;
  text: string;
  link: string;
}

export function NetworkItem({ name, icon, text, link }: NetworkItemProps) {
  return (
    <>
      <div className="flex items-center gap-2 sm:gap-5 mb-[25px]">
        <Image src={icon} alt={name} width={24} height={24} />
        <span className="font-semibold text-4 leading-[22px] sm:text-5 sm:leading-[27px]">
          {name}
        </span>
      </div>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="underline text-disabled text-4 leading-4 sm:text-5 sm:leading-5 pt-1"
      >
        {text}
      </a>
    </>
  );
}
