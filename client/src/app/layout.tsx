import React, { Suspense } from "react";

import type { Metadata } from "next";

import { AuthContextProvider } from "@/context";

import { Toaster, MainLayout } from "@/components";

import { TanstackProvider } from "@/providers";

import { Manrope } from "next/font/google";
import "./globals.css";


const manrope = Manrope({
  variable: "--font-monrope",
  subsets: ["latin"],
})

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
          className={`${manrope.variable} dark antialiased bg-background`}
        >
          <Toaster />
          <Suspense>
            <AuthContextProvider>
              <MainLayout>{children}</MainLayout>
            </AuthContextProvider>
          </Suspense>
        </body>
      </html>
    </TanstackProvider>
  );
}
