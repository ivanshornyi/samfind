"use client";

import React, { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { useSendVerificationCode } from "@/hooks";

import {
  AlertDialog,
  AlertDialogTrigger,
  Button,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  Input,
} from "@/components";

import { X } from "lucide-react";

export const SendVerificationCodeModal = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const {
    mutate: sendVerificationCodeMutation,
    isPending: isSendingPending,
    isSuccess: isSendingSuccess,
  } = useSendVerificationCode();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (email === "") return;

    sendVerificationCodeMutation(email);
  };

  useEffect(() => {
    if (isSendingSuccess) {
      router.push(`/auth/reset-password?recoveryEmail=${email}`);
    }
  }, [isSendingSuccess, email, router]);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="text-sm text-blue-400 mt-2 hover:opacity-80">
          Forgot password
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-[420px]">
        <div className="absolute right-0 top-0">
          <AlertDialogCancel className="shadow-none border-none p-3">
            <X size={18} />
          </AlertDialogCancel>
        </div>

        <AlertDialogHeader>
          <AlertDialogTitle>Password recovery</AlertDialogTitle>
          <AlertDialogDescription>
            Email for verification code
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div>
          <form className="flex" onSubmit={handleSubmit}>
            <Input
              placeholder="Enter email"
              className="rounded-r-none px-3 py-6"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <Button
              className="rounded-l-none py-6 border-[1px] border-primary"
              loading={isSendingPending}
              disabled={isSendingPending}
              withLoader={true}
            >
              Send
            </Button>
          </form>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
