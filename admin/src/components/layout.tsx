import { Outlet } from "react-router";
import { Header, Toaster } from "@/components";
import { AuthContextProvider } from "@/context";
import { TanstackProvider } from "@/providers";
import { SidebarProvider } from "./ui/sidebar";
import { AppSidebar } from "./app-sidebar";

export const Layout = () => {
  return (
    <TanstackProvider>
      <AuthContextProvider>
        <SidebarProvider>
          <AppSidebar />
          <Toaster />
          <div className="w-full">
            <Header />
            <main className="pt-20">
              <Outlet />
            </main>
          </div>
        </SidebarProvider>
      </AuthContextProvider>
    </TanstackProvider>
  );
};
