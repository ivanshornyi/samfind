"use client";

import Image from "next/image";

interface NetworkItemProps {
  name: string;
  icon: string;
  link: string;
}

export function NetworkItem({ name, icon, link }: NetworkItemProps) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="p-[10px]"
    >
      <Image src={icon} alt={name} width={24} height={24} />
    </a>
  );
}
