"use client";

import React, { useContext } from "react";
import Link from "next/link";
import { AuthContext } from "@/context";
import { Button } from "@/components";
import { User } from "lucide-react";
import Image from "next/image";

const NAVIGATION_ITEMS = [
  {
    title: "Pricing",
    path: "/pricing",
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
    <header className="font-manrope w-full fixed top-0 left-0 z-10 px-5">
      <div className="container w-full mx-auto flex items-center justify-between py-4">
        <Link href="/">
          <Image src="/Logo.png" width={110} height={30} alt="" />
        </Link>

        <nav>
          <ul className="flex items-center gap-8">
            {NAVIGATION_ITEMS.map((item) => (
              <Link key={item.title} href={item.path}>
                <li className="font-semibold text-base hover:opacity-80">
                  {item.title}
                </li>
              </Link>
            ))}
          </ul>
        </nav>

        {!isLoggedIn ? (
          <div className="flex items-center gap-2">
            <Link href="/auth/sign-in">
              <Button variant="ghost" className="w-[133px] text-base">
                <span>Log in</span>
              </Button>
            </Link>
            <Link href="/auth/sign-in">
              <Button
                variant="secondary"
                className="w-[148px] h-[38px] bg-[#363637] rounded-[30px] text-base"
              >
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
      </div>
    </header>
  );
};
