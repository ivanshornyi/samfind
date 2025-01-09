import { Outlet } from "react-router";
import { Header } from "./header";
import { AuthContextProvider } from "@/context";
import { TanstackProvider } from "@/providers";
import { Toaster } from "./ui";

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
