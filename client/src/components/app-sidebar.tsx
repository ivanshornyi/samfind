import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Logo } from "@public/images";
import { Home, IdCard, Gift, CreditCard } from "lucide-react";
import {
  SidebarProfileIcon,
  SidebarSupportIcon,
  SidebarLogoutIcon,
} from "@public/icons";
import Image from "next/image";
import { Button } from "./ui";

const NAVIGATION_ITEMS = [
  {
    title: "Home",
    path: "/",
    icon: Home,
  },
  {
    title: "License management",
    path: "/",
    icon: IdCard,
  },
  {
    title: "Invite friends",
    path: "/",
    icon: Gift,
  },
  {
    title: "Billing data",
    path: "/",
    icon: CreditCard,
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="px-[20px] py-8 border-secondary">
      <SidebarHeader>
        <Image src={Logo} width={110} height={40} alt="Logo" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAVIGATION_ITEMS.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.path}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="space-y-4">
        <Button variant="tetrary">
          <Image
            src={SidebarProfileIcon}
            width={24}
            height={24}
            alt="profile icon"
          />
          <span>Profile settings</span>
        </Button>
        <Button variant="tetrary">
          <Image
            src={SidebarSupportIcon}
            width={24}
            height={24}
            alt="profile icon"
          />
          <span>Support</span>
        </Button>
        <Button variant="tetrary">
          <Image
            src={SidebarLogoutIcon}
            width={24}
            height={24}
            alt="profile icon"
          />
          <span>Logout</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
