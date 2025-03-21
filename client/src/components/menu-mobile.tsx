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
import { LogoSvg } from "@public/images";
import { Close as CloseSheet } from "@radix-ui/react-dialog";
import Image from "next/image";
import Link from "next/link";
import { useContext, useState } from "react";
import { ArrowDownWhite, ArrowDownPink } from "@public/icons";

export const MenuMobile = () => {
  const { isLoggedIn, user } = useContext(AuthContext);
  const [openProducts, setOpenProducts] = useState<boolean>(false);

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
          className="h-dvh border-none bg-transparent backdrop-blur-[14px] bg-gradient-to-b from-[#1F1E1FCC] to-[#1F1E1F]"
        >
          <div className="absolute top-0 right-0 left-0 bottom-0 z-[-1000]"></div>
          <SheetHeader className="justify-between h-[80%]">
            <div className="flex justify-between items-center">
              <Link href="/">
                <Image
                  src={LogoSvg}
                  alt="logo"
                  width={80}
                  className="h-[22.5px] w-[80px] min-w-[80px] "
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
                {NAVIGATION_ITEMS.map((item) =>
                  item.subItems ? (
                    <li
                      className="relative"
                      key={item.title}
                      onClick={() => setOpenProducts(!openProducts)}
                    >
                      <span
                        className={`flex flex-row justify-center gap-[8px] font-medium ${openProducts ? "text-violet-50 underline" : ""} active:text-violet-200 cursor-pointer text-[14px]`}
                      >
                        {item.title}
                        <Image
                          alt="arrow down icon"
                          className={`transition transform duration-700 ${openProducts ? "hidden" : ""}`}
                          src={ArrowDownWhite}
                        />
                        <Image
                          alt="arrow down icon"
                          className={`transition transform duration-700 ${!openProducts ? "hidden" : ""}`}
                          src={ArrowDownPink}
                        />
                      </span>
                      <ul hidden={!openProducts}>
                        <div
                          className={`flex flex-col text-center gap-5 pt-5 transition-all duration-700 transform:h-${openProducts ? "0%" : "180%"}`}
                        >
                          {item.subItems.map((subItem) => (
                            <SheetClose asChild key={subItem.title}>
                              <Link href={subItem.path}>
                                <span
                                  key={subItem.title}
                                  className="font-medium text-[#A8A8A8] hover:text-violet-50 hover:underline active:text-violet-200 cursor-pointer text-center py-[8px] text-[14px]"
                                >
                                  {subItem.title}
                                </span>
                              </Link>
                            </SheetClose>
                          ))}
                        </div>
                      </ul>
                    </li>
                  ) : (
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
                  )
                )}
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
