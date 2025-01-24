"use client";

import { usePathname } from "next/navigation";

import { Footer, Header } from "@/components";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const hideHeaderAndFooter = pathname.startsWith("/auth") || pathname.startsWith("/account");

  return (
    <div className="max-w-[1440px] mx-auto">
      {!hideHeaderAndFooter && <Header />}

      <main className={`${hideHeaderAndFooter ? "" : "pt-20"} px-4 sm:px-5`}>{children}</main>
      {!hideHeaderAndFooter && <Footer />}
    </div>
  );
};
