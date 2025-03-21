"use client";

import { useGetUserRoleSubscriptionInfo } from "@/hooks";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  Button,
  LogoutModal,
} from "@/components";

import { usePathname } from "next/navigation";
import { IdCard, Gift, CreditCard, User, Download, Wallet } from "lucide-react";
import { Logo } from "@public/images";
import Link from "next/link";
import Image from "next/image";
import { Support, GoTo } from "@public/icons/index";

const NAVIGATION_ITEMS = [
  {
    title: "License management",
    path: "/account/license",
    icon: IdCard,
  },
  {
    title: "Referral system",
    path: "/account/invite-friends",
    icon: Gift,
  },
  {
    title: "Billing data",
    path: "/account/billing-data",
    icon: CreditCard,
  },
  {
    title: "Profile settings",
    path: "/account/settings",
    icon: User,
  },
  {
    title: "Wallet",
    path: "/account/wallet",
    icon: Wallet,
  },
];

const INVITED_USER_NAVIGATION_ITEMS = [
  {
    title: "License management",
    path: "/account/license",
    icon: IdCard,
  },
  {
    title: "Profile settings",
    path: "/account/settings",
    icon: User,
  },
];

export const AppSidebar = () => {
  const pathname = usePathname();

  const { data: userSubscriptionInfo } = useGetUserRoleSubscriptionInfo();

  return (
    <Sidebar className="py-8 border-secondary bg-background">
      <SidebarHeader className="px-4 h-[60px] bg-background">
        <Link href="/">
          <Image src={Logo} width={110} height={40} alt="Logo" />
        </Link>
      </SidebarHeader>
      <SidebarContent className="bg-background">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-4">
              {!userSubscriptionInfo?.invitedUser &&
                !userSubscriptionInfo?.deletedMember &&
                NAVIGATION_ITEMS.map((item) => {
                  const isActive = pathname === item.path;

                  return (
                    <SidebarMenuItem key={item.title}>
                      <Link href={item.path}>
                        <Button
                          variant="menuItem"
                          leftIcon={
                            <item.icon
                              style={{ width: "24px", height: "24px" }}
                            />
                          }
                          className={`
                        ${isActive && "bg-[#302935] text-white"}
                        w-full flex justify-start items-center
                      `}
                        >
                          <span>{item.title}</span>
                        </Button>
                      </Link>
                    </SidebarMenuItem>
                  );
                })}

              {(userSubscriptionInfo?.invitedUser ||
                userSubscriptionInfo?.deletedMember) &&
                INVITED_USER_NAVIGATION_ITEMS.map((item) => {
                  const isActive = pathname === item.path;

                  return (
                    <SidebarMenuItem key={item.title}>
                      <Link href={item.path}>
                        <Button
                          variant="menuItem"
                          leftIcon={
                            <item.icon
                              style={{ width: "24px", height: "24px" }}
                            />
                          }
                          className={`
                        ${isActive && "bg-[#302935] text-white"}
                        w-full flex justify-start items-center
                      `}
                        >
                          <span>{item.title}</span>
                        </Button>
                      </Link>
                    </SidebarMenuItem>
                  );
                })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="space-y-4 px-4 bg-background">
        <Link href="/">
          <Button
            variant="menuItem"
            leftIcon={
              <Image
                src={GoTo}
                alt="go to Onsio.io"
                style={{ width: "24px", height: "24px" }}
              />
            }
          >
            Go to Onsio.io
          </Button>
        </Link>
        <Link href="/download-app">
          <Button
            variant="menuItem"
            leftIcon={<Download style={{ width: "24px", height: "24px" }} />}
          >
            Get App / Software
          </Button>
        </Link>
        <Link href="/support">
          <Button
            variant="menuItem"
            leftIcon={
              <Image
                src={Support}
                alt="support"
                style={{ width: "24px", height: "24px" }}
              />
            }
          >
            Support
          </Button>
        </Link>
        {/* <Button
          variant="menuItem"
          leftIcon={<Headset style={{ width: "24px", height: "24px" }} />}
        >
          Support
        </Button> */}
        <LogoutModal />
      </SidebarFooter>
    </Sidebar>
  );
};
