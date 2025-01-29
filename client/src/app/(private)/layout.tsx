"use client";

import React, { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthContext } from "@/context";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

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
