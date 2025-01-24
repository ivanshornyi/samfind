"use client";

import React, { useContext, useEffect, useState } from "react";

import { AuthContext } from "@/context";

import { useUpdateUser } from "@/hooks/api/user";

import { Button, Card, FullScreenLoader, Input } from "@/components";
import { ChangeEmailModal } from "./_components";

import { UserStatus } from "@/types";
import { useToast } from "@/hooks";

import { ShieldPlus, ShieldMinus, Copy } from "lucide-react";

const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_DOMAIN;

export default function Settings() {
  const { toast } = useToast();
  const { user, userLoading } = useContext(AuthContext);

  const [userFormData, setUserFormData] = useState({
    firstName: "",
    lastName: "",
  });

  const [userPasswordFormData, setUserPasswordFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const {
    mutate: updateUserDataMutation,
    isPending: isUpdateUserPending,
    isSuccess: isUpdateUserSuccess,
  } = useUpdateUser();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;

    setUserFormData({ ...userFormData, [name]: value });
  };

  const handlePasswordFormInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const name = event.target.name;
    const value = event.target.value;

    setUserPasswordFormData({ ...userPasswordFormData, [name]: value });
  };

  const handleSaveSettingsSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (userFormData.firstName === "" || userFormData.lastName === "") {
      toast({
        description: "Some fields are empty",
      });
    }

    if (user)
      updateUserDataMutation({
        id: user?.id,
        userData: userFormData,
      });
  };

  const handleChangePasswordSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (
      userPasswordFormData.newPassword !== userPasswordFormData.confirmPassword
    ) {
      toast({
        description: "Password is not the same",
      });

      return;
    }

    if (
      userPasswordFormData.newPassword === "" ||
      userPasswordFormData.confirmPassword === ""
    ) {
      toast({
        description: "Some fields are empty",
      });

      return;
    }

    if (user) {
      updateUserDataMutation({
        id: user.id,
        userData: { password: userPasswordFormData.newPassword },
      });
    }
  };

  useEffect(() => {
    if (user) {
      setUserFormData({
        firstName: user.firstName,
        lastName: user.lastName,
      });
    }
  }, [user]);

  useEffect(() => {
    if (isUpdateUserSuccess) {
      setUserPasswordFormData({
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [isUpdateUserSuccess]);

  return (
    <div className="pb-[50px] flex justify-center">
      {(isUpdateUserPending || userLoading) && <FullScreenLoader />}
    </div>
  );
}
