import { Outlet } from "react-router";
import { Header, Toaster } from "@/components";
import { AuthContextProvider } from "@/context";
import { TanstackProvider } from "@/providers";

export const Layout = () => {
  return (
    <TanstackProvider>
      <AuthContextProvider>
        <Toaster />
        <div>
          <Header />
          <main className="pt-20">
            <Outlet />
          </main>
        </div>
      </AuthContextProvider>
    </TanstackProvider>
  );
};
