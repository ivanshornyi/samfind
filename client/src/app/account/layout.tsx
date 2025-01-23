"use client";

import React, { useContext } from "react";

import { AuthContext } from "@/context";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components";

import { UserRoundCog, File, LogOut } from "lucide-react";

const NAVIGATION_ITEMS = [
  {
    title: "License",
    path: "/account/license",
    icon: <File />,
  },
  {
    title: "Account settings",
    path: "/account/settings",
    icon: <UserRoundCog />,
  },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { logout } = useContext(AuthContext);

  return (
    <div className="container mx-auto">
      <div className="flex gap-10">
        <div>
          <ul className="flex flex-col min-w-[220px]">
            {NAVIGATION_ITEMS.map((item) => {
              const isActive = pathname === item.path;

              return (
                <Link key={item.title} href={item.path}>
                  <li>
                    <Button
                      variant={isActive ? "outline" : "ghost"}
                      className={`
                        ${!isActive && "hover:opacity-80"}
                        w-full flex justify-start items-center
                      `}
                    >
                      {item.icon}
                      <span>{item.title}</span>
                    </Button>
                  </li>
                </Link>
              );
            })}
          </ul>

          <div className="mt-3 pt-3 border-t-[1px]">
            <Button
              variant="secondary"
              onClick={logout}
              className="w-[220px] flex items-center justify-start"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </Button>
          </div>
        </div>

        <div className="w-full">{children}</div>
      </div>
    </div>
  );
}
