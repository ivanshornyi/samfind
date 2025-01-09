import React from "react";

import type { Metadata } from "next";

import { AuthContextProvider } from "@/context";

import { Header, Toaster } from "@/components";

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
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100`}
        >
          <Toaster />
          <AuthContextProvider>
            <Header />

            <main className="pt-20 px-5">{children}</main>
          </AuthContextProvider>
        </body>
      </html>
    </TanstackProvider>
  );
}
