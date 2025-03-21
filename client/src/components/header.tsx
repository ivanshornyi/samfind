"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

import { Button } from "@/components";
import { AuthContext } from "@/context";
import { LogoSvg } from "@public/images";
import { User } from "lucide-react";
import { MenuMobile } from "./menu-mobile";
import { ArrowDownWhite, ArrowDownPink } from "@public/icons";

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
    title: "Support",
    path: "/support",
  },
  {
    title: "Invest",
    path: "/invest",
  },
  {
    title: "Products",
    subItems: [
      { title: "Mobile App (IOS, Android)", path: "/#mobile", isHash: true },
      { title: "Software (MacOS, Windows)", path: "/#software", isHash: true },
      { title: "Web Platform (Onsio.ai)", path: "/#intro", isHash: true },
    ],
  },
  //  {
  //   title: "License Management",
  //   path: "/license-management",
  // },
];

export const Header = () => {
  const { isLoggedIn, user } = useContext(AuthContext);
  const router = useRouter();
  const pathname = usePathname();
  const [openProducts, setOpenProducts] = useState<boolean>(false);

  const handleNavigation = (path: string, isHash?: boolean) => {
    if (isHash) {
      if (pathname === "/") {
        // If we're already on home page, smooth scroll to the section
        console.log(path);
        document
          .getElementById(path.split("#")[1])
          ?.scrollIntoView({ behavior: "smooth" });
      } else {
        // If we're on a different page, navigate to home page with hash
        router.push(path);
      }
    } else {
      router.push(path);
    }
  };

  const [bgColor, setBgColor] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) setBgColor(true);
      else setBgColor(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`
        w-full fixed top-0 left-0 z-10 bg-[#1F1E1F]
        px-5 ${bgColor ? "transition duration-500" : "transition duration-500 bg-transparent"}
      `}
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
            <Image src={LogoSvg} width={110} height={28} alt="logo" />
          </div>
          <nav className="hidden lg:block">
            <ul className="flex items-center gap-8 text-[12px] sm:text-[16px]">
              {NAVIGATION_ITEMS.map((item) => (
                <li key={item.title}>
                  {!item.subItems ? (
                    <span
                      className="font-medium text-base transition-all hover:text-violet-50 hover:underline active:text-violet-200 cursor-pointer"
                      onClick={() => handleNavigation(item.path, item.isHash)}
                    >
                      {item.title}
                    </span>
                  ) : (
                    <span
                      className="relative"
                      onMouseEnter={() => setOpenProducts(!openProducts)}
                      onMouseLeave={() => setOpenProducts(!openProducts)}
                    >
                      <span
                        className={`group flex flex-row gap-[8px] font-medium text-base transition-all ${openProducts ? "text-violet-50 underline" : ""} active:text-violet-200 cursor-pointer`}
                      >
                        {item.title}
                        <Image
                          id="headerArrow"
                          alt="arrow down icon"
                          className={`transition duration-700 ${openProducts ? "hidden" : ""}`}
                          src={ArrowDownWhite}
                        />{" "}
                        <Image
                          id="headerArrow"
                          alt="arrow down icon"
                          className={`transition duration-700 ${!openProducts ? "hidden" : ""}`}
                          src={ArrowDownPink}
                        />
                      </span>
                      <ul
                        hidden={!openProducts}
                        className="absolute left-[-32px] bg-transparent top-[20px] w-[262px] rounded-[16px] p-[16px] gap-[8px]"
                      >
                        <div className="flex items-center w-[262px] bg-[#222222] h-[168px] rounded-[16px] gap-[8px] justify-center align-center">
                          <div className="flex flex-col gap-[12px]">
                            {item.subItems.map((subItem) => (
                              <button
                                key={subItem.title}
                                className="font-medium text-[#A8A8A8] text-[16px] transition-all hover:text-violet-50 hover:underline active:text-violet-200 cursor-pointer text-start border-b-[1px] border-[#363637] pb-[8px]"
                                onClick={() =>
                                  handleNavigation(subItem.path, subItem.isHash)
                                }
                              >
                                {subItem.title}
                              </button>
                            ))}
                          </div>
                        </div>
                      </ul>
                    </span>
                  )}
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
