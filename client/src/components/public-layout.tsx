"use client";

import { usePathname } from "next/navigation";

import { Footer, Header } from "@/components";

export const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const hideHeaderAndFooter =
    pathname.startsWith("/auth") || pathname.startsWith("/account");

  return (
    <div className="max-w-full sm:max-w-[1440px] sm:ml-auto sm:mr-auto">
      {!hideHeaderAndFooter && <Header />}

      <main className={`${hideHeaderAndFooter ? "" : "pt-20"} px-4 sm:px-5`}>
        {children}
      </main>
      {!hideHeaderAndFooter && <Footer />}
    </div>
  );
};
