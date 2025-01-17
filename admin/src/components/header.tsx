import { NavLink } from "react-router";
import { Button } from "@/components";
import { LogOut } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "@/context";
import { SidebarTrigger } from "./ui/sidebar";

export const Header = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);

  return (
    <header
      className="
        border-b-[1px] w-full fixed top-0 left-0 z-10 bg-card
        px-5 md:px-0
      "
    >
      <div
        className="
          container w-full mx-auto flex items-center justify-between
          py-4
        "
      >
        <div className="flex gap-2">
          {isLoggedIn ? <SidebarTrigger /> : null}
          <NavLink to="/">
            <p className="text-xl font-bold font-sans select-none">Samfind</p>
          </NavLink>
        </div>

        <div className="flex gap-6 items-center">
          {isLoggedIn ? (
            <Button onClick={logout}>
              <LogOut size={14} />
              <p>Logout</p>
            </Button>
          ) : null}
        </div>
      </div>
    </header>
  );
};
