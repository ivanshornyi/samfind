import React from "react";

import Image from "next/image";

import { EllipseBlueImage } from "@public/about";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Image 
        src={EllipseBlueImage} 
        alt="ellipse" 
        className="absolute left-0 top-[100px]"
      />
      {children}
    </div>
  );
}