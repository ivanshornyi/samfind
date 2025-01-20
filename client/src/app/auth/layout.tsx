"use client";

import React, { useContext, useEffect } from "react";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { AuthContext } from "@/context";

import { Logo } from "../../../public";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isLoggedIn } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn]);

  return (
    <div className="container px-5 h-[100dvh] mx-auto flex justify-center items-center">
      <div className="flex flex-col items-center gap-8">
        <div>
          <Link href="/">
            <Image src={Logo} alt="logo" className="w-24 h-6" />
          </Link>
        </div>
        <div className="flex items-center justify-center">{children}</div>
        <div>
          <p>@ Osio2025. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
