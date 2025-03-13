"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useContext } from "react";

import { Button } from "@/components";
import { AuthContext } from "@/context";

import { Logo } from "@public/images";
import { User } from "lucide-react";
import { MenuMobile } from "./menu-mobile";

export const NAVIGATION_ITEMS = [
  {
    title: "Pricing",
    path: "/#pricing",
    isHash: true,
  },
  {
    title: "About",
    path: "/about",
  },
  {
    title: "FAQ",
    path: "/faq",
  },
  {
    title: "Invest",
    path: "/invest",
  },
  // {
  //   title: "License Management",
  //   path: "/license-management",
  // },
];

export const Header = () => {
  const { isLoggedIn, user } = useContext(AuthContext);
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (path: string, isHash?: boolean) => {
    if (isHash) {
      if (pathname === "/") {
        // If we're already on home page, smooth scroll to the section
        document
          .getElementById("pricing")
          ?.scrollIntoView({ behavior: "smooth" });
      } else {
        // If we're on a different page, navigate to home page with hash
        router.push(path);
      }
    } else {
      router.push(path);
    }
  };

  return (
    <header
      className="
        w-full fixed top-0 left-0 z-10 bg-transparent
        px-5
      "
    >
      <div
        className="
          container w-full max-w-[1440px] mx-auto flex items-center justify-between
          py-4
        "
      >
        <div className="flex items-center gap-10">
          <div
            onClick={() => router.push("/")}
            className="z-1000 cursor-pointer"
          >
            <Image src={Logo} width={110} height={28} alt="logo" />
          </div>

          <nav className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {NAVIGATION_ITEMS.map((item) => (
                <li
                  key={item.title}
                  onClick={() => handleNavigation(item.path, item.isHash)}
                  className="font-medium text-base transition-all hover:text-violet-50 hover:underline active:text-violet-200 cursor-pointer"
                >
                  {item.title}
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="hidden lg:flex gap-6 items-center">
          {!isLoggedIn ? (
            <div className="flex items-center gap-8">
              <Link href="/auth/sign-in">
                <span>Log in</span>
              </Link>

              <Link href="/auth/account-type">
                <Button variant="tetrary" className="py-2 px-8 border-none">
                  <span>Sign up</span>
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {user && (
                <Link
                  href="/account/license"
                  className="flex items-center gap-2"
                >
                  <Button variant="tetrary" className="flex">
                    <User />
                    <span>Account</span>
                  </Button>
                </Link>
              )}
            </>
          )}
        </div>

        <MenuMobile />
      </div>
    </header>
  );
};
