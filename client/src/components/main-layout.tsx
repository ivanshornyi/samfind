"use client";

import { usePathname } from "next/navigation";

import { Header } from "@/components";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const hideHeader = pathname.startsWith("/auth");

  return (
    <div>
      {!hideHeader && <Header />}

      <main className={`${hideHeader ? "" : "pt-20"} px-5`}>{children}</main>
    </div>
  );
};
