import { useContext } from "react";

import { AuthContext } from "@/context";

import { User } from "lucide-react";

export const UserAccountTypeBox = () => {
  const { user } = useContext(AuthContext);
  
  return (
    <div className="capitalize text-blue-50 flex items-center justify-center gap-2 bg-card rounded-full px-3 py-2  w-[200px]">
      <User size={18} />
      {user?.accountType} Account
    </div>
  );
};