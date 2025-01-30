"use client";

import React, { useEffect, useState } from "react";

import { useSearchParams } from "next/navigation";

import { useToast, useVerifyUser } from "@/hooks";

import { VerifyData } from "@/services";

import { UserAccountType } from "@/types";

import {
  AlertDialog,
  Button,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  Input,
} from "@/components";

import { X } from "lucide-react";

interface VerifyUserModalProps {
  isOpen: boolean;
  email: string;
}

export const VerifyUserModal: React.FC<VerifyUserModalProps> = ({
  isOpen,
  email,
}) => {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [code, setCode] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { mutate: verifyUserMutation, isPending: isVerifyingPending } =
    useVerifyUser();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (code === "") {
      toast({
        description: "Code is empty",
      });

      return;
    }

    let verifyData: VerifyData = {
      email,
      verificationCode: code,
    };

    const licenseId = searchParams.get("lId");
    const organizationId = searchParams.get("orgId");
    const accountType = searchParams.get("accountType");

    if (licenseId) {
      verifyData = {
        ...verifyData,
        licenseId,
      };
    }

    if (organizationId) {
      if (accountType === UserAccountType.Business) {
        toast({
          description: "You can not add business account for this organization",
        });

        return;
      }

      verifyData = {
        ...verifyData,
        organizationId,
      };
    }

    verifyUserMutation(verifyData);
  };

  useEffect(() => {
    setIsModalOpen(isOpen);
  }, [isOpen]);

  return (
    <AlertDialog open={isModalOpen}>
      <AlertDialogContent className="w-[591px] p-8">
        <div className="absolute right-5 top-5">
          <AlertDialogCancel
            className="shadow-none border-none p-1 rounded-full bg-card"
            onClick={() => setIsModalOpen(false)}
          >
            <X size={18} />
          </AlertDialogCancel>
        </div>

        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">
            Verify your email
          </AlertDialogTitle>
          <AlertDialogDescription>
            Enter your verification code
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div>
          <form onSubmit={handleSubmit}>
            <Input
              placeholder="Verification code"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              maxLength={6}
            />
            <Button
              variant="secondary"
              className="w-full mt-4"
              loading={isVerifyingPending}
              disabled={isVerifyingPending}
              withLoader={true}
            >
              Verify
            </Button>
          </form>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
