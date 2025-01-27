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
import {
  Home,
  IdCard,
  Gift,
  CreditCard,
  User,
  Headset,
  LogOut,
} from "lucide-react";
import Image from "next/image";
import { Button } from "./ui";
import { LogoutModal } from "./logout-modal";

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
    <Sidebar className="py-8 border-secondary">
      <SidebarHeader className="px-4 h-[60px] mb-6">
        <Image src={Logo} width={110} height={40} alt="Logo" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-4">
              {NAVIGATION_ITEMS.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <Button
                    variant="menuItem"
                    leftIcon={
                      <item.icon style={{ width: "24px", height: "24px" }} />
                    }
                  >
                    <a href={item.path}>
                      <span>{item.title}</span>
                    </a>
                  </Button>
                </SidebarMenuItem>
              ))}
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
        <LogoutModal />
      </SidebarFooter>
    </Sidebar>
  );
}
