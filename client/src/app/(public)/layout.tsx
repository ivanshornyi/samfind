"use client";

import { PublicLayout } from "@/components";
import ChatBot from "@/components/chat-bot/chat-bot";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PublicLayout>
      {children}
      <ChatBot />
    </PublicLayout>
  );
}
