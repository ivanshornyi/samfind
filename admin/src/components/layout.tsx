import { Outlet } from "react-router";
import { Header } from "./header";

export const Layout = () => {
  return (
    <div>
      <Header />
      <main className="pt-20">
        <Outlet />
      </main>
    </div>
  );
};
