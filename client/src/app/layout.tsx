import React, { Suspense } from "react";

import type { Metadata } from "next";

import { AuthContextProvider } from "@/context";

import { Toaster } from "@/components";

import { TanstackProvider } from "@/providers";

import { Manrope } from "next/font/google";
import "./globals.css";
import { ChatProvider } from "@/providers/chat";

const manrope = Manrope({
  variable: "--font-monrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Onsio",
  description: "Onsio app",
  icons: "/favicon.png",
  keywords: [
    "Onsio",
    "AI File search",
    "Offline AI",
    "AI chat",
    "AI web search",
    "Deep research",
    "Encrypted AI",
    "Data protected AI",
    "Advanced AI",
    "AI Database",
    "Onsio shares",
    "Onsio trading platform",
    "Share purchase",
    "Crowd funding",
    "Buy Shares",
    "Sell shares",
    "Investor",
    "Startup",
    "Raise capital",
    "Kjøpe akjser",
    "Selge Aksjer",
    "Emisjon",
    "Hente kapital",
    "Speach-to-speach",
    "Speach 2 speach",
    "Speach to text",
  ].join(", "),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TanstackProvider>
      <ChatProvider>
        <html lang="en">
          <body
            className={`${manrope.variable} antialiased bg-background w-full`}
          >
            <Toaster />
            <Suspense>
              <AuthContextProvider>{children}</AuthContextProvider>
            </Suspense>
          </body>
        </html>
      </ChatProvider>
    </TanstackProvider>
  );
}
