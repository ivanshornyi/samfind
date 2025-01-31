"use client";

import React, { useContext, useState } from "react";

import {
  AlertDialog,
  Button,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogFooter,
} from "@/components";

import { LogOut, X } from "lucide-react";
import { AuthContext } from "@/context";

export const LogoutModal = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { logout } = useContext(AuthContext);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <Button
        variant="menuItem"
        leftIcon={<LogOut style={{ width: "24px", height: "24px" }} />}
        onClick={() => setOpen(true)}
      >
        Logout
      </Button>
      <AlertDialogContent className="w-[590px] border gradient-border-modal p-8">
        <div className="absolute right-1 top-1">
          <AlertDialogCancel className="shadow-none border-none p-3">
            <X size={18} />
          </AlertDialogCancel>
        </div>

        <AlertDialogHeader className="space-y-4">
          <AlertDialogTitle className="text-[32px] leading-[44px] font-semibold">
            Are you sure you want to log out?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[20px] leading-[27px]">
            Any unsaved changes will be lost.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex gap-6 w-full">
          <Button
            className="w-full"
            variant="tetrary"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            className="w-full"
            variant="secondary"
            withLoader={true}
            onClick={logout}
          >
            Log out
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
