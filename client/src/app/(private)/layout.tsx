"use client";

import React, { useContext, useState } from "react";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { HeaderMenuIcon } from "@public/icons";

import { AuthContext } from "@/context";
import { Logo } from "@public/images";
import Link from "next/link";
import Image from "next/image";

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
          <div className="px-4 md:px-[60px] py-[68px] md:pt-8 w-full">
            <MobileHeader />
            {children}
          </div>
        </SidebarProvider>
      ) : null}
    </>
  );
}

function MobileHeader() {
  return (
    <header className="md:hidden w-full fixed top-0 left-0 z-10 bg-background px-2">
      <div className="flex items-center justify-between relative">
        <SidebarTrigger
          className="mr-auto w-[44px] h-[44px]"
          customIcon={
            <Image src={HeaderMenuIcon} alt="menu" width={80} height={44} />
          }
        />
        <Link
          href="/"
          className="absolute left-1/2 transform -translate-x-1/2"
        >
          <Image src={Logo} width={80} height={44} alt="logo" />
        </Link>
      </div>
    </header>
  );
}
