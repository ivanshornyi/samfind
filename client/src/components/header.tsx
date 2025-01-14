"use client";

import React, { useContext } from "react";

import Link from "next/link";

import { AuthContext } from "@/context";

import { Button } from "@/components";

import { LogIn, User } from "lucide-react";

const NAVIGATION_ITEMS = [
  {
    title: "Home",
    path: "/",
  },
  {
    title: "Buy product",
    path: "/products",
  },
];

export const Header = () => {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <header
      className="
        border-b-[1px] w-full fixed top-0 left-0 z-10 bg-card
        px-5
      "
    >
      <div
        className="
          container w-full mx-auto flex items-center justify-between
          py-4
        "
      >
        <Link href="/">
          <p className="text-xl font-bold font-sans select-none">Samfind</p>
        </Link>

        <div className="flex gap-6 items-center">
          <nav>
            <ul className="flex items-center gap-2">
              {NAVIGATION_ITEMS.map((item) => (
                <Link key={item.title} href={item.path}>
                  <li className="font-medium text-sm hover:opacity-80">
                    {item.title}
                  </li>
                </Link>
              ))}
            </ul>
          </nav>

          {!isLoggedIn ? (
            <Link href="/auth/sign-in">
              <Button>
                <LogIn size={14} />
                <span>Login</span>
              </Button>
            </Link>
          ) : (
            <Link href="/account/license" className="flex items-center gap-2">
              <Button variant="secondary" className="text-zinc-800 flex">
                <User />
                <span>Account</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
