"use client";

import React, { useContext } from "react";

import Link from "next/link";
import Image from "next/image";

import { AuthContext } from "@/context";

import { Button } from "@/components";

import { Logo } from "../../public";

const NAVIGATION_ITEMS = [
  {
    title: "Pricing",
    path: "/",
  },
  {
    title: "About",
    path: "/",
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
        w-full fixed top-0 left-0 z-10 bg-background
        px-5
      "
    >
      <div
        className="
          container w-full mx-auto flex items-center justify-between
          py-4
        "
      >
        <div className="flex items-center gap-10">
          <Link href="/">
            <Image src={Logo} alt="logo" className="h-7 w-[110px]" />
          </Link>

          <nav>
            <ul className="flex items-center gap-8">
              {NAVIGATION_ITEMS.map((item) => (
                <Link key={item.title} href={item.path}>
                  <li className="font-medium text-sm hover:opacity-80">
                    {item.title}
                  </li>
                </Link>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex gap-6 items-center">
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
              <Button variant="secondary" className="flex">
                <span>Account</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
