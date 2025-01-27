"use client";

import { useContext } from "react";

import { AuthContext } from "@/context";

import { usePathname } from "next/navigation";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Logo } from "@public/images";

import Image from "next/image";
import { Button } from "./ui";

import {
  Home,
  IdCard,
  Gift,
  CreditCard,
  User,
  Headset,
  LogOut,
} from "lucide-react";

const NAVIGATION_ITEMS = [
  {
    title: "Home",
    path: "/account/home",
    icon: Home,
  },
  {
    title: "License management",
    path: "/account/home",
    icon: IdCard,
  },
  {
    title: "Invite friends",
    path: "/account/home",
    icon: Gift,
  },
  {
    title: "Billing data",
    path: "/account/home",
    icon: CreditCard,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { logout } = useContext(AuthContext);

  return (
    <Sidebar className="py-8 border-secondary">
      <SidebarHeader className="px-4 h-[60px] mb-6">
        <Image src={Logo} width={110} height={40} alt="Logo" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-4">
              {NAVIGATION_ITEMS.map((item) => {
                const isActive = pathname === item.path;

                return (
                <SidebarMenuItem 
                  key={item.title}
                >
                  <Link href={item.path}>
                    <Button
                      variant="menuItem"
                      leftIcon={
                        <item.icon style={{ width: "24px", height: "24px" }} />
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
              )})}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="space-y-4 px-4">
        <Button
          variant="menuItem"
          leftIcon={<User style={{ width: "24px", height: "24px" }} />}
        >
          Profile settings
        </Button>
        <Button
          variant="menuItem"
          leftIcon={<Headset style={{ width: "24px", height: "24px" }} />}
        >
          Support
        </Button>
        <Button
          variant="menuItem"
          leftIcon={<LogOut style={{ width: "24px", height: "24px" }} />}
          onClick={logout}
        >
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
