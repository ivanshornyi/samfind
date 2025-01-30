"use client";

import React, { useContext, useEffect } from "react";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { AuthContext } from "@/context";

import { GoogleOAuthProvider } from "@react-oauth/google";

import { ArrowLeftIcon } from "lucide-react";

import { Logo, BgVioletEllipse } from "@public/images";

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string;

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
    <GoogleOAuthProvider clientId={googleClientId}>
      <div className="container px-5 h-[100dvh] mx-auto flex flex-col gap-4 justify-between items-center">
      <Image 
        src={BgVioletEllipse} 
        alt="ellipse" 
        priority
        className="absolute left-0 top-0 z-0 w-[60%]"
      />

      <Link href="/" className="fixed top-6 left-5 flex items-center gap-3">
        <ArrowLeftIcon size={30} />
        <span>Back</span>
      </Link>
      <div className="pt-12">
        <Link href="/">
          <Image src={Logo} alt="logo" className="w-24 h-6.5" />
        </Link>
      </div>
      <div className="flex items-center justify-center relative z-10">{children}</div>
        <div className="py-5">
          <p>@ Osio2025. All rights reserved.</p>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
