import React, { useContext, useEffect, useState } from "react";

import { AuthContext } from "@/context";

import { useRouter } from "next/navigation";

import { useSendVerificationCodeToUpdateEmail, useToast } from "@/hooks";

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
  AlertDialogFooter,
} from "@/components";

import { X } from "lucide-react";

export const ChangeEmailModal = () => {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const {
    mutate: sendVerificationCodeMutation,
    isPending: isSendingPending,
    isSuccess: isSendingSuccess,
  } = useSendVerificationCodeToUpdateEmail();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (formData.email === "" || formData.password === "") {
      toast({
        description: "Some fields are empty",
      });

      return;
    }

    if (user) {
      sendVerificationCodeMutation({
        userId: user.id,
        email: formData.email,
        password: formData.password,
      });
    }
  };

  useEffect(() => {
    if (isSendingSuccess)
      router.push(`/account/settings/reset-email?email=${formData.email}`);
  }, [isSendingSuccess, formData.email, router]);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="w-full mt-4">Change email</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-[400px]">
        <div className="absolute right-0 top-0">
          <AlertDialogCancel className="shadow-none border-none p-3">
            <X size={18} />
          </AlertDialogCancel>
        </div>

        <AlertDialogHeader>
          <AlertDialogTitle>Email changing</AlertDialogTitle>
          <AlertDialogDescription>
            Enter new email and password
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div>
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <Input
              type="email"
              name="email"
              placeholder="Enter your new email"
              className="px-3 py-6"
              value={formData.email}
              onChange={handleInputChange}
            />
            <Input
              name="password"
              type="password"
              placeholder="Enter your password"
              className="px-3 py-6 mt-2"
              value={formData.password}
              onChange={handleInputChange}
            />

            <AlertDialogFooter className="flex gap-2 justify-end mt-3 pt-2">
              <AlertDialogCancel
                className="px-6 py-5"
                disabled={isSendingPending}
              >
                Cancel
              </AlertDialogCancel>
              <Button
                className="px-6 py-5"
                loading={isSendingPending}
                disabled={isSendingPending}
                withLoader={true}
              >
                Submit
              </Button>
            </AlertDialogFooter>
          </form>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
