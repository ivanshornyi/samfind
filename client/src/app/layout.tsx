import React, { Suspense } from "react";

import type { Metadata } from "next";

import { AuthContextProvider } from "@/context";

import { Toaster, MainLayout } from "@/components";

import { TanstackProvider } from "@/providers";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background`}
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
