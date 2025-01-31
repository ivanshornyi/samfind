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

export const SendResetPasswordCodeModal = () => {
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
        <button className="font-semibold mt-2 underline hover:opacity-80">
          Forgot your password?
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-[591px] p-8">
        <div className="absolute right-5 top-5">
          <AlertDialogCancel className="shadow-none border-none p-1 rounded-full bg-card">
            <X size={18} />
          </AlertDialogCancel>
        </div>

        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">
            Forgot your password?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Enter your email address to receive a recovery code.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div>
          <form onSubmit={handleSubmit}>
            <Input
              placeholder="Email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <Button
              variant="secondary"
              className="w-full mt-4"
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
