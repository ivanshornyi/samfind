"use client";

import React, { useContext } from "react";
import Link from "next/link";
import Image from "next/image";

import { AuthContext } from "@/context";
import { Button } from "@/components";

import { Logo } from "../../public";
import { User } from "lucide-react";

const NAVIGATION_ITEMS = [
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
    path: "/",
  },
  {
    title: "Contact",
    path: "/",
  },
  {
    title: "License Management",
    path: "/",
  },
];

export const Header = () => {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <header
      className="
        w-full max-w-[1440px] fixed top-0 left-0 z-10 bg-background
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
            <Image
              src={Logo}
              alt="logo"
              width={110}
              className="h-7 w-[110px] min-w-[110px]"
            />
          </Link>

          <nav className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {NAVIGATION_ITEMS.map((item) => (
                <Link key={item.title} href={item.path}>
                  <li className="font-medium text-base transition-all hover:text-[#CE9DF3] hover:underline active:text-[#8F40E5]">
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

              <Link href="/auth/sign-up">
                <Button variant="tetrary" className="py-2 px-8 border-none">
                  <span>Sign up</span>
                </Button>
              </Link>
            </div>
          ) : (
            <Link href="/account/license" className="flex items-center gap-2">
              <Button variant="secondary" className="text-zinc-800 flex">
                <User />
                <span>Account</span>
              </Button>
            </Link>
          )}
          ) : (
            <Link href="/account/license" className="flex items-center gap-2">
              <Button variant="secondary" className="text-zinc-800 flex">
                <User />
                <span>Account</span>
              </Button>
            </Link>
          )}
        </div>

        <div className="lg:hidden">
          <Image
            src="icons/header-menu.svg"
            alt="menu"
            width={44}
            height={44}
          />
        </div>
      </div>
    </header>
  );
};
