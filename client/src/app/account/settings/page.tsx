"use client";

import React, { useContext, useEffect, useState } from "react";

import { AuthContext } from "@/context";

import { useUpdateUser } from "@/hooks/api/user";

import { Button, Card, FullScreenLoader, Input } from "@/components";

import { UserStatus } from "@/types";
import { useToast } from "@/hooks";

import { ShieldPlus, ShieldMinus, LogOut, LoaderCircle } from "lucide-react";

export default function Settings() {
  const { toast } = useToast();
  const { user, userLoading, logout } = useContext(AuthContext);
  const [userFormData, setUserFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [userPasswordFormData, setUserPasswordFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const { mutate: updateUserDataMutation, isPending: isUpdateUserPending } =
    useUpdateUser();

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

    if (userFormData.firstName === "" || userFormData.email === "") {
      toast({
        description: "Some fields are empty",
      });
    }

    user && updateUserDataMutation({ id: user?.id, userData: userFormData });
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
    }

    user &&
      updateUserDataMutation({
        id: user.id,
        userData: { password: userPasswordFormData.newPassword },
      });
  };

  // const handleDeactivateAccount = () => {
  //   if (user) {
  //     if (user.status === UserStatus.Active) {
  //       updateUserDataMutation({ id: user.id, userData: { status: UserStatus.Inactive } });
  //     } else {
  //       updateUserDataMutation({ id: user.id, userData: { status: UserStatus.Active } });
  //     }

  //     // update user
  //   }
  // };

  useEffect(() => {
    if (user) {
      setUserFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
    }
  }, [user]);

  return (
    <div>
      {(isUpdateUserPending || userLoading) && <FullScreenLoader />}

      <h2 className="text-[24px]">
        <span>Settings</span>
      </h2>

      <div>
        <p>
          <span>Account status: </span>
          {!userLoading && (
            <span
              className={`${user?.status === UserStatus.Active ? "text-green-500" : "text-orange-400"}`}
            >
              {user?.status === UserStatus.Active ? "active" : "inactive"}
            </span>
          )}
        </p>
      </div>

      <div className="flex gap-3 items-start">
        <Card className="min-w-[360px] px-8 py-7 mt-5">
          <p className="font-semibold text-[18px]">Change credentials</p>

          <form
            onSubmit={handleSaveSettingsSubmit}
            className="mt-3 flex flex-col gap-2"
          >
            <div>
              <label htmlFor="firstName" className="text-sm">
                First name
              </label>
              <Input
                id="firstName"
                name="firstName"
                className="py-5 px-3"
                value={userFormData.firstName}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label id="lastName" className="text-sm">
                Last name
              </label>
              <Input
                id="lastName"
                name="lastName"
                className="py-5 px-3"
                value={userFormData.lastName}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label id="email" className="text-sm">
                Email
              </label>
              <Input
                id="email"
                name="email"
                className="py-5 px-3 disabled:opacity-80"
                type="email"
                value={userFormData.email}
                onChange={handleInputChange}
                disabled={true}
              />
            </div>

            <Button className="mt-3 w-full py-5">Save</Button>
          </form>
        </Card>

        <Card className="min-w-[360px] px-8 py-7 mt-5">
          <p className="font-semibold text-[18px]">Change password</p>

          <form
            onSubmit={handleChangePasswordSubmit}
            className="mt-3 flex flex-col gap-2"
          >
            <div>
              <label className="text-sm">New password</label>
              <Input
                name="newPassword"
                type="password"
                value={userPasswordFormData.newPassword}
                onChange={handlePasswordFormInputChange}
                className="py-5 px-3"
              />
            </div>
            <div>
              <label className="text-sm">Confirm password</label>
              <Input
                name="confirmPassword"
                type="password"
                value={userPasswordFormData.confirmPassword}
                onChange={handlePasswordFormInputChange}
                className="py-5 px-3"
              />
            </div>

            <Button className="mt-3 w-full py-5">Update</Button>
          </form>
        </Card>
      </div>

      <Card className="px-10 py-5 mt-3">
        <p className="font-semibold text-[18px]">Deactivate account</p>
        <p className="text-sm text-gray-600">
          This action will change your status
        </p>

        <Button
          variant="destructive"
          className={`${user?.status === UserStatus.Inactive && "bg-green-600 hover:bg-green-500"} mt-4`}
          // onClick={handleDeactivateAccount}
        >
          {user?.status === UserStatus.Active ? (
            <>
              <ShieldMinus size={18} />
              <span>Deactivate</span>
            </>
          ) : (
            <>
              <ShieldPlus size={18} />
              <span>Activate</span>
            </>
          )}
        </Button>
      </Card>
    </div>
  );
}
