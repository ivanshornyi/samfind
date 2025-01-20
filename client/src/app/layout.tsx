import React, { Suspense } from "react";

import type { Metadata } from "next";

import { AuthContextProvider } from "@/context";

import { Footer, Header, Toaster } from "@/components";

import { TanstackProvider } from "@/providers";

import { Manrope } from "next/font/google";
import "./globals.css";


const manrope = Manrope({
  variable: "--font-monrope",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Samfind",
  description: "Samfind app",
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
          className={`${manrope.variable} dark antialiased bg-[#1F1E1F]`}
        >
          <Toaster />
          <Suspense>
            <AuthContextProvider>
              <Header />

              <main className="pt-20 px-5">{children}</main>
              <Footer />
            </AuthContextProvider>
          </Suspense>
        </body>
      </html>
    </TanstackProvider>
  );
}
