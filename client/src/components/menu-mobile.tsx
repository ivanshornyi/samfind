"use client";

import {
  Button,
  NAVIGATION_ITEMS,
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components";
import { AuthContext } from "@/context";
import { HeaderMenuCloseIcon, HeaderMenuIcon } from "@public/icons";
import { Logo } from "@public/images";
import { Close as CloseSheet } from "@radix-ui/react-dialog";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";

export const MenuMobile = () => {
  const { isLoggedIn, user } = useContext(AuthContext);
  return (
    <div className="lg:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <button>
            <Image src={HeaderMenuIcon} alt="menu" width={44} height={44} />
          </button>
        </SheetTrigger>
        <SheetContent
          side="bottom"
          hideClose
          className="h-dvh border-none bg-transparent backdrop-blur-[14px]"
        >
          <div className="absolute top-0 right-0 left-0 bottom-0 z-[-1000]"></div>
          <SheetHeader className="justify-between h-[80%]">
            <div className="flex justify-between items-center">
              <Link href="/">
                <Image
                  src={Logo}
                  alt="logo"
                  width={110}
                  className="h-7 w-[110px] min-w-[110px]"
                />
              </Link>
              <CloseSheet asChild>
                <Image
                  src={HeaderMenuCloseIcon}
                  alt="menu"
                  width={44}
                  height={44}
                />
              </CloseSheet>
            </div>

            <nav>
              <SheetTitle className="font-semibold text-xl mb-5 text-center">
                Menu
              </SheetTitle>
              <ul className="flex items-center flex-col gap-5">
                {NAVIGATION_ITEMS.map((item) => (
                  <li key={item.title}>
                    <SheetClose asChild>
                      <Link
                        href={item.path}
                        className="font-medium text-sm transition-all hover:text-[#CE9DF3] hover:underline active:text-[#8F40E5]"
                      >
                        {item.title}
                      </Link>
                    </SheetClose>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex flex-col gap-4">
              {!isLoggedIn ? (
                <>
                  <SheetClose asChild>
                    <Link href="/auth/sign-in">
                      <Button variant="link" className="text-base w-full">
                        Log in
                      </Button>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="/auth/account-type">
                      <Button variant="tetrary" className="text-base w-full">
                        Sign up
                      </Button>
                    </Link>
                  </SheetClose>
                </>
              ) : (
                user && (
                  <SheetClose asChild>
                    <Link
                      href={
                        user.licenseId || user.organizationId
                          ? "/account/license"
                          : "/account/settings"
                      }
                    >
                      <Button variant="tetrary" className="text-base w-full">
                        Account
                      </Button>
                    </Link>
                  </SheetClose>
                )
              )}
            </div>

            <div className="absolute flex justify-center right-0 left-0 bottom-10">
              <p className="text-sm font-normal">
                @ Onsio2025. All rights reserved.{" "}
              </p>
            </div>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
};
