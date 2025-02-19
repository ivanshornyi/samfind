"use client";

import React, { useContext, useEffect, useState } from "react";

import {
  Button,
  FullScreenLoader,
  Input,
  UserAccountTypeBox,
} from "@/components";
import { AuthContext } from "@/context";
import {
  useDeleteDeviceIdFromLicense,
  useGetUserActiveLicense,
  useToast,
} from "@/hooks";
import {
  useGetOrganization,
  useUpdateOrganization,
} from "@/hooks/api/organization";
import { useUpdateUser } from "@/hooks/api/user";
import { useQueryClient } from "@tanstack/react-query";

import { DeleteAccount } from "./_components";
import { UserAccountType } from "@/types";
import { X } from "lucide-react";

export default function Settings() {
  const { toast } = useToast();
  const { user, userLoading } = useContext(AuthContext);
  const [editName, setEditName] = useState(false);
  const [editOrganization, setEditOrganization] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const [userFormData, setUserFormData] = useState({
    firstName: "",
    lastName: "",
  });
  const queryClient = useQueryClient();
  const [userPasswordFormData, setUserPasswordFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const {
    mutate: updateUserDataMutation,
    isPending: isUpdateUserPending,
    isSuccess: isUpdateUserSuccess,
  } = useUpdateUser();

  const [organizationFormData, setOrganizationFormData] = useState({
    name: "",
    businessOrganizationNumber: "",
    VAT: "",
  });

  const [mobileIs, setMobileIds] = useState<string[]>([]);
  const [desktopIs, setDesktopIds] = useState<string[]>([]);

  const { data: organization, isLoading: isOrganizationLoading } =
    useGetOrganization(user?.organizationId ?? "");

  const {
    mutate: updateOrganizationMutation,
    isPending: isUpdateOrganizationPending,
  } = useUpdateOrganization();

  const { data: activeLicense } = useGetUserActiveLicense(user?.id);

  const { mutate: deleteDeviceIdFromLicense } = useDeleteDeviceIdFromLicense();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;

    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleInputOrganizationChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const name = event.target.name;
    const value = event.target.value;

    setOrganizationFormData({ ...organizationFormData, [name]: value });
  };

  const handlePasswordFormInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const name = event.target.name;
    const value = event.target.value;

    setUserPasswordFormData({ ...userPasswordFormData, [name]: value });
  };

  const handleUpdateOrganization = () => {
    if (!user?.organizationId) return;

    updateOrganizationMutation(
      {
        id: user.organizationId,
        organizationData: {
          name: organizationFormData.name,
          businessOrganizationNumber:
            organizationFormData.businessOrganizationNumber,
          VAT: organizationFormData.VAT,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["organization", user.organizationId],
          });
        },
      }
    );
  };

  const handleSaveSettingsSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (userFormData.firstName === "" || userFormData.lastName === "") {
      toast({
        description: "Some fields are empty",
        variant: "default",
      });
    }

    if (user)
      updateUserDataMutation({
        id: user?.id,
        userData: userFormData,
      });
    setEditName(false);
  };

  const handleEditCancelSetting = () => {
    if (editName && user)
      setUserFormData({
        firstName: user.firstName,
        lastName: user.lastName,
      });
    setEditName(!editName);
  };

  const handleEditCancelOrganization = () => {
    if (editOrganization && organization)
      setOrganizationFormData({
        name: organization.name,
        businessOrganizationNumber: organization.businessOrganizationNumber,
        VAT: organization.VAT,
      });
    setEditOrganization(!editOrganization);
  };

  const handleChangePasswordSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (
      userPasswordFormData.newPassword !== userPasswordFormData.confirmPassword
    ) {
      toast({
        description: "Password is not the same",
        variant: "default",
      });

      return;
    }

    if (
      userPasswordFormData.newPassword === "" ||
      userPasswordFormData.confirmPassword === ""
    ) {
      toast({
        description: "Some fields are empty",
        variant: "default",
      });

      return;
    }

    if (user) {
      updateUserDataMutation({
        id: user.id,
        userData: { password: userPasswordFormData.newPassword },
      });
    }
    setEditPassword(false);
  };

  const handleEditCancelChangePassword = () => {
    if (editPassword)
      setUserPasswordFormData({
        newPassword: "",
        confirmPassword: "",
      });
    setEditPassword(!editPassword);
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

  useEffect(() => {
    if (organization) {
      setOrganizationFormData({
        name: organization.name,
        businessOrganizationNumber:
          organization.businessOrganizationNumber ?? "",
        VAT: organization.VAT ?? "",
      });
    }
  }, [organization]);

  useEffect(() => {
    console.log(activeLicense);
    if (activeLicense) {
      setDesktopIds(activeLicense.desktopIds);
      setMobileIds(activeLicense.mobileIds);
    }
  }, [activeLicense]);

  return (
    <div className="pb-[50px] flex justify-center">
      {(isUpdateUserPending ||
        userLoading ||
        isOrganizationLoading ||
        isUpdateOrganizationPending) && <FullScreenLoader />}
      <div className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full">
          <h2 className="text-2xl sm:text-[32px] leading-[44px] font-semibold mb-4 sm:mb-0">
            Profile settings
          </h2>
          <UserAccountTypeBox />
        </div>
        <div className="mt-8 sm:mt-[77px]">
          <h3 className="text-[20px] leading-[27px] font-semibold">
            Personal details
          </h3>
          <div className="w-full mt-6 pb-2 border-b border-[#444444]">
            <div className="flex justify-between items-start w-full">
              <div className="w-full">
                <div className="flex gap-2">
                  <div className="w-full">
                    <p className="text-[16px] leading-[22px] font-semibold">
                      First Name
                    </p>
                    <div className="w-full max-w-[220px] mt-2">
                      {editName ? (
                        <Input
                          name="firstName"
                          type="text"
                          value={userFormData.firstName}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <p className="text-[14px] leading-[29px] text-disabled font-medium">
                          {userFormData.firstName}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="w-full">
                    <p className="text-[16px] leading-[22px] font-semibold">
                      Last Name
                    </p>
                    <div className="w-full max-w-[220px] mt-2 ">
                      {editName ? (
                        <Input
                          name="lastName"
                          type="text"
                          value={userFormData.lastName}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <p className="text-[14px] leading-[29px] text-disabled font-medium">
                          {userFormData.lastName}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <Button variant="edit" onClick={handleEditCancelSetting}>
                {editName ? "Cancel" : "Edit"}
              </Button>
            </div>
            {editName && (
              <Button
                className="mt-2 w-[148px]"
                variant="saveProfile"
                onClick={handleSaveSettingsSubmit}
              >
                Save
              </Button>
            )}
          </div>
          <div className="w-full mt-6 pb-2 border-b border-[#444444]">
            <p className="text-[16px] leading-[22px] font-semibold">Email</p>
            <p className="text-[14px] leading-[29px] text-disabled font-medium">
              {user?.email}
            </p>
          </div>
          <div className="w-full mt-6 pb-2 border-b border-[#444444]">
            <div className="flex justify-between items-start w-full">
              <div className="w-full">
                <p className="text-[16px] leading-[22px] font-semibold">
                  User password
                </p>
                <div className="w-full max-w-[450px] mt-2">
                  {editPassword ? (
                    <div className="flex gap-2">
                      <Input
                        eye
                        placeholder="New password"
                        name="newPassword"
                        type="password"
                        value={userPasswordFormData.newPassword}
                        onChange={handlePasswordFormInputChange}
                      />
                      <Input
                        eye
                        placeholder="Repeat password"
                        name="confirmPassword"
                        type="password"
                        value={userPasswordFormData.confirmPassword}
                        onChange={handlePasswordFormInputChange}
                      />
                    </div>
                  ) : (
                    <p className="text-[14px] leading-[29px] text-disabled font-medium">
                      *********
                    </p>
                  )}
                </div>
              </div>
              <Button variant="edit" onClick={handleEditCancelChangePassword}>
                {editPassword ? "Cancel" : "Edit"}
              </Button>
            </div>
            {editPassword && (
              <Button
                className="mt-2 w-[148px]"
                variant="saveProfile"
                onClick={handleChangePasswordSubmit}
              >
                Save
              </Button>
            )}
          </div>
        </div>
        {desktopIs.length || mobileIs.length ? (
          <div className="mt-8 sm:mt-[77px]">
            <h3 className="text-[20px] leading-[27px] font-semibold">
              Your Devices
            </h3>
            {desktopIs.length ? (
              <div className="mt-3">
                <p className="text-[16px] leading-[22px]">Desktop</p>
                <div className="flex gap-2 flex-wrap mt-2">
                  {desktopIs.map((id) => (
                    <div
                      key={id}
                      className="text-[14px] leading-[19px] font-medium p-2 px-4 flex items-center gap-2 bg-input rounded-[30px]"
                    >
                      <span>{id}</span>
                      <X
                        onClick={() =>
                          deleteDeviceIdFromLicense({
                            activeLicenseId: activeLicense!.id,
                            desktopId: id,
                          })
                        }
                        className="cursor-pointer text-disabled hover:text-light"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            {mobileIs.length ? (
              <div className="mt-3">
                <p className="text-[16px] leading-[22px]">Mobile</p>
                <div className="flex gap-2 flex-wrap mt-2">
                  {mobileIs.map((id) => (
                    <div
                      key={id}
                      className="text-[14px] leading-[19px] font-medium p-2 px-4 flex items-center gap-2 bg-input rounded-[30px]"
                    >
                      <span>{id}</span>
                      <X
                        onClick={() =>
                          deleteDeviceIdFromLicense({
                            activeLicenseId: activeLicense!.id,
                            mobileId: id,
                          })
                        }
                        className="cursor-pointer text-disabled hover:text-light"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
        {user?.accountType === UserAccountType.Business && (
          <div className="mt-[77px]">
            <h3 className="text-[20px] leading-[27px] font-semibold">
              Company details
            </h3>
            <div className="w-full mt-6 pb-2 border-b border-[#444444]">
              <div className="flex justify-between items-start w-full">
                <div className="w-full">
                  <div className="flex flex-col gap-4">
                    <div className="relative flex justify-between">
                      <div className="w-full max-w-[220px] mt-2 ">
                        <p className="text-[16px] leading-[22px] font-semibold mb-2">
                          Company name
                        </p>

                        {editOrganization ? (
                          <Input
                            name="name"
                            type="text"
                            value={organizationFormData.name}
                            onChange={handleInputOrganizationChange}
                          />
                        ) : (
                          <p className="text-[14px] leading-[29px] text-disabled font-medium">
                            {organization?.name || "Not provided"}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="edit"
                        onClick={handleEditCancelOrganization}
                      >
                        {editOrganization ? "Cancel" : "Edit"}
                      </Button>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-1 ">
                        <p className="text-[16px] leading-[22px] font-semibold mb-2">
                          Business registration number
                        </p>
                        {editOrganization ? (
                          <Input
                            name="businessOrganizationNumber"
                            type="text"
                            className="max-w-[220px]"
                            value={
                              organizationFormData.businessOrganizationNumber
                            }
                            onChange={handleInputOrganizationChange}
                          />
                        ) : (
                          <p className="text-[14px] leading-[29px] text-disabled font-medium">
                            {organization?.businessOrganizationNumber ||
                              "Not provided"}
                          </p>
                        )}
                      </div>

                      <div className="flex-1">
                        <p className="text-[16px] leading-[22px] font-semibold mb-2">
                          VAT number
                        </p>
                        {editOrganization ? (
                          <Input
                            name="VAT"
                            type="text"
                            className="max-w-[220px]"
                            value={organizationFormData.VAT}
                            onChange={handleInputOrganizationChange}
                          />
                        ) : (
                          <p className="text-[14px] leading-[29px] text-disabled font-medium">
                            {organization?.VAT || "Not provided"}
                          </p>
                        )}
                      </div>
                    </div>
                    {editOrganization && (
                      <Button
                        className="mt-2 w-[148px]"
                        variant="saveProfile"
                        onClick={handleUpdateOrganization}
                      >
                        Save
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-[77px]">
          <h3 className="text-[20px] leading-[27px] font-semibold">
            Manage account
          </h3>
          <div className="flex justify-between items-start w-full mt-6 pb-2 border-b border-[#444444]">
            <div className="w-full ">
              <p className="text-[16px] leading-[22px] font-semibold">
                Delete account
              </p>
              <p className="text-[14px] leading-[29px] text-disabled font-medium">
                Permanenlty deactive the account
              </p>
            </div>
            <DeleteAccount />
          </div>
        </div>
      </div>
    </div>
  );
}
