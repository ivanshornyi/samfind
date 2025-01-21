"use client";

import { usePathname } from "next/navigation";

import { Footer, Header } from "@/components";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const hideHeader = pathname.startsWith("/auth");

  return (
    <div className="max-w-[1440px] mx-auto">
      {!hideHeader && <Header />}

      <main className={`${hideHeader ? "" : "pt-20"}  px-5`}>{children}</main>
      <Footer />
    </div>
  );
};
