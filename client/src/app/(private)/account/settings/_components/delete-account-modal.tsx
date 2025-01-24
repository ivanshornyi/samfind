import React from "react";

import {
  AlertDialog,
  AlertDialogTrigger,
  Button,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogFooter,
} from "@/components";

import { X } from "lucide-react";

export const DeleteAccount = () => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="text-[#FF7676]" variant="edit">
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-[590px]">
        <div className="absolute right-0 top-0">
          <AlertDialogCancel className="shadow-none border-none p-3">
            <X size={18} />
          </AlertDialogCancel>
        </div>

        <AlertDialogHeader>
          <AlertDialogTitle className="text-[32px] leading-[44px] font-semibold">
            Delete Account?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[20px] leading-[27px]">
            Are you sure you want to delete your account? Please note:
          </AlertDialogDescription>
        </AlertDialogHeader>

        <ul className="list-disc list-inside space-y-2 text-[16px] leading-[22px] text-disabled">
          <li>This action is permanent and cannot be undone.</li>
          <li>All your data will be lost.</li>
          <li>Your subscription will be canceled.</li>
          <li>All participants in your group will lose access.</li>
        </ul>

        <AlertDialogFooter className="flex gap-6 w-full">
          <AlertDialogCancel className="w-full border-none p-0">
            <Button className="w-full" variant="saveProfile">
              Cancel
            </Button>
          </AlertDialogCancel>
          <Button
            className="w-full bg-[#FF6C6C] hover:bg-[#D23535] active:bg-[#302935]"
            variant="saveProfile"
            withLoader={true}
          >
            Delete account
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
