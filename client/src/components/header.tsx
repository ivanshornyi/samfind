"use client";

import React, { useContext } from "react";
import Link from "next/link";
import Image from "next/image";

import { AuthContext } from "@/context";
import { Button } from "@/components";

import { Logo } from "@public/images";
import { User } from "lucide-react";
import { MenuMobile } from "./menu-mobile";

export const NAVIGATION_ITEMS = [
  {
    title: "Pricing",
    path: "/",
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
    title: "Contact",
    path: "/contact",
  },
  {
    title: "License Management",
    path: "/license-management",
  },
];

export const Header = () => {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <header
      className="
        w-full fixed top-0 left-0 z-10 bg-background
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
          <Link href="/">
            <Image src={Logo} width={110} height={28} alt="logo" />
          </Link>

          <nav className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {NAVIGATION_ITEMS.map((item) => (
                <Link key={item.title} href={item.path}>
                  <li className="font-medium text-base transition-all hover:text-violet-50 hover:underline active:text-violet-200">
                    {item.title}
                  </li>
                </Link>
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
            <Link href="/account/settings" className="flex items-center gap-2">
              <Button variant="secondary" className="flex">
                <User />
                <span>Account</span>
              </Button>
            </Link>
          )}
        </div>

        <MenuMobile />
      </div>
    </header>
  );
};
