import React, { Suspense } from "react";

import type { Metadata } from "next";

import { AuthContextProvider } from "@/context";

import { Toaster } from "@/components";

import { TanstackProvider } from "@/providers";

import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-monrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Onsio",
  description: "Onsio app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TanstackProvider>
      <html lang="en">
        <body
          className={`${manrope.variable} dark antialiased bg-background w-full max-w-[1440px] mx-auto`}
        >
          <Toaster />
          <Suspense>
            <AuthContextProvider>{children}</AuthContextProvider>
          </Suspense>
        </body>
      </html>
    </TanstackProvider>
  );
}
