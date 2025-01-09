"use client";

import { NavLink } from "react-router";

const NAVIGATION_ITEMS = [
  {
    title: "Home",
    path: "/",
  },
  {
    title: "User Management",
    path: "/user-management",
  },
];

export const Header = () => {
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
        <NavLink to="/">
          <p className="text-xl font-bold font-sans select-none">Samfind</p>
        </NavLink>

        <div className="flex gap-6 items-center">
          <nav>
            <ul className="flex items-center gap-2">
              {NAVIGATION_ITEMS.map((item) => (
                <NavLink key={item.title} to={item.path}>
                  <li className="font-medium text-sm hover:opacity-80">
                    {item.title}
                  </li>
                </NavLink>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};
