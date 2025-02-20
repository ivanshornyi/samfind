"use client";

import React, { useEffect, useState } from "react";

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
import { X } from "lucide-react";
import { useDeleteMemberFromLicense } from "@/hooks";

interface DeleteMemberProps {
  activeLicenseId: string;
  userName: string;
  email?: string;
}

export const DeleteMember = ({
  activeLicenseId,
  userName,
  email,
}: DeleteMemberProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const { mutate: deleteMember, isSuccess } = useDeleteMemberFromLicense();

  useEffect(() => {
    if (isSuccess === true) setOpen(false);
  }, [isSuccess]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <Button
        variant={"edit"}
        className="text-[#FF6C6C] hover:text-[#D23535] active:text-[#302935]"
        onClick={() => setOpen(true)}
      >
        Delete user
      </Button>
      <AlertDialogContent className="w-[380px] sm:w-[590px]">
        <div className="absolute right-1 top-1">
          <AlertDialogCancel className="shadow-none border-none p-3">
            <X size={18} />
          </AlertDialogCancel>
        </div>

        <AlertDialogHeader>
          <AlertDialogTitle className="text-[32px] leading-[44px] font-semibold">
            Delete user?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[16px] leading-[22px] text-disabled">
            Removing this user will revoke their license and they will no longer
            have access to the group.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="mt-8 mb-8 flex items-center gap-4">
          <div
            className="
            flex justify-center items-center rounded-full 
            w-10 h-10 bg-input text-[24px] leading-[33px] 
            text-link-hover font-semibold
          "
          >
            {userName[0]}
          </div>
          <p>{userName}</p>
          <p>{email}</p>
        </div>

        <AlertDialogFooter className="flex gap-6 w-full">
          <Button
            className="w-full"
            variant="saveProfile"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={() => deleteMember(activeLicenseId)}
            className="w-full bg-[#FF6C6C] hover:bg-[#D23535] active:bg-[#302935]"
            variant="saveProfile"
            withLoader={true}
          >
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
