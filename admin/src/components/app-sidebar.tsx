import { Home, Link, User } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useContext } from "react";
import { AuthContext } from "@/context";

const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "User management",
    url: "user-management",
    icon: User,
  },
  {
    title: "Referral management",
    url: "referral-management",
    icon: Link,
  },
];

export function AppSidebar() {
  const { isLoggedIn } = useContext(AuthContext);

  if (!isLoggedIn) return null;

  return (
    <Sidebar>
      <SidebarContent className="pt-20">
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
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
    </Sidebar>
  );
}
