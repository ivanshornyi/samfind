"use client";

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
import { useContext } from "react";
import { AuthContext } from "@/context";
import { usePathname } from "next/navigation";
import { Home, IdCard, Gift, CreditCard, User, Headset } from "lucide-react";
import { Logo } from "@public/images";
import Link from "next/link";
import Image from "next/image";

const NAVIGATION_ITEMS = [
  {
    title: "Home",
    path: "/",
    icon: Home,
  },
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
];

export const AppSidebar = () => {
  const { user } = useContext(AuthContext);
  const pathname = usePathname();

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
              {NAVIGATION_ITEMS.map((item, index) => {
                const isActive = pathname === item.path;
                const condition = user;

                return condition || index === 0 ? (
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
                ) : null;
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="space-y-4 px-4 bg-background">
        <Link href="/account/settings">
          <Button
            variant="menuItem"
            leftIcon={<User style={{ width: "24px", height: "24px" }} />}
          >
            Profile settings
          </Button>
        </Link>
        <Button
          variant="menuItem"
          leftIcon={<Headset style={{ width: "24px", height: "24px" }} />}
        >
          Support
        </Button>
        <LogoutModal />
      </SidebarFooter>
    </Sidebar>
  );
};
