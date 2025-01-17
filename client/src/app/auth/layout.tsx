"use client";

import React, { useContext, useEffect } from "react";

import { useRouter } from "next/navigation";

import { AuthContext } from "@/context";

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
    <div className="container mx-auto px-5 md:px-0">
      <div className="flex items-center justify-center font-manrope">{children}</div>
    </div>
  );
}
