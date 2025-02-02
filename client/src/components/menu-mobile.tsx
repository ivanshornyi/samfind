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
import { HeaderMenuIcon, HeaderMenuCloseIcon } from "@public/icons";
import { Close as CloseSheet } from "@radix-ui/react-dialog";
import { Logo } from "@public/images";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { AuthContext } from "@/context";
import { User } from "lucide-react";

export const MenuMobile = () => {
  const { isLoggedIn, user } = useContext(AuthContext);
  return (
    <div className="lg:hidden">
      <Sheet>
        <SheetTrigger>
          <Image src={HeaderMenuIcon} alt="menu" width={44} height={44} />
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
              <CloseSheet>
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
                  <Link key={item.title} href={item.path}>
                    <SheetClose>
                      <li className="font-medium text-sm transition-all hover:text-[#CE9DF3] hover:underline active:text-[#8F40E5]">
                        {item.title}
                      </li>
                    </SheetClose>
                  </Link>
                ))}
              </ul>
            </nav>

            {!isLoggedIn ? (
              <div className="flex flex-col">
                <Link href="/auth/sign-in">
                  <Button variant="link" className="text-base w-full">
                    Log in
                  </Button>
                </Link>
                <Link href="/auth/account-type">
                  <Button variant="tetrary" className="text-base w-full">
                    Sign up
                  </Button>
                </Link>
              </div>
            ) : (
              user && (
                <Link
                  href={
                    user.licenseId || user.organizationId
                      ? "/account/license"
                      : "/account/settings"
                  }
                  className="flex items-center gap-2"
                >
                  <Button
                    variant="tetrary"
                    className="flex w-full max-w-96 mx-auto"
                  >
                    <User />
                    <span>Account</span>
                  </Button>
                </Link>
              )
            )}

            <div className="absolute flex justify-center right-0 left-0 bottom-10">
              <p className="text-sm font-normal">
                @ Osio2025. All rights reserved.{" "}
              </p>
            </div>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
};
