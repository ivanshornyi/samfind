"use client";

import React, { useContext } from "react";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

import { AuthContext } from "@/context";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useContext(AuthContext);

  return (
    <>
      {user ? (
        <SidebarProvider>
          <AppSidebar />
          <div className="px-[60px] pt-8 w-full">{children}</div>
        </SidebarProvider>
      ) : null}
    </>
  );
}
