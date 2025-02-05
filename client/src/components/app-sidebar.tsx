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
import { IdCard, Gift, CreditCard, User, Headset, Download } from "lucide-react";
import { Logo } from "@public/images";
import Link from "next/link";
import Image from "next/image";

const NAVIGATION_ITEMS = [
  {
    title: "License management",
    path: "/account/license",
    icon: IdCard,
  },
  {
    title: "Invite friends",
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
  }
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
            {!userSubscriptionInfo?.invitedUser && NAVIGATION_ITEMS.map(item => {
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

            {userSubscriptionInfo?.invitedUser && (
              <SidebarMenuItem>
              <Link href="/account/license">
                <Button
                  variant="menuItem"
                  leftIcon={
                    <IdCard
                      style={{ width: "24px", height: "24px" }}
                    />
                  }
                  className={`
                    ${pathname === "/account/license" && "bg-[#302935] text-white"}
                    w-full flex justify-start items-center
                  `}
                >
                  <span>License management</span>
                </Button>
              </Link>
            </SidebarMenuItem>
            )}

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="space-y-4 px-4 bg-background">
        <Link href="/download-app">
          <Button
            variant="menuItem"
            leftIcon={<Download style={{ width: "24px", height: "24px" }} />}
          >
            Download app
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
