"use client";

import { Button, FullScreenLoader, Input } from "@/components";
import { AuthContext } from "@/context";
import { useToast } from "@/hooks";
import {
  useGetOrganization,
  useUpdateOrganization,
} from "@/hooks/api/organization";
import { useUpdateUser } from "@/hooks/api/user";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, User, X } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { DeleteAccount } from "./_components";

export default function Settings() {
  const { toast } = useToast();
  const { user, userLoading } = useContext(AuthContext);
  const [editName, setEditName] = useState(false);
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
    domains: [""],
  });

  const { data: organization, isLoading: isOrganizationLoading } =
    useGetOrganization(user?.organizationId ?? "");

  const {
    mutate: updateOrganizationMutation,
    isPending: isUpdateOrganizationPending,
  } = useUpdateOrganization();

  const [editDomains, setEditDomains] = useState(false);
  const [domains, setDomains] = useState<string[]>([""]);

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

  const handleDomainChange = (index: number, value: string) => {
    const newDomains = [...domains];
    newDomains[index] = value;
    setDomains(newDomains);
  };

  const addDomain = () => {
    setDomains([...domains, ""]);
  };

  const removeDomain = (index: number) => {
    const newDomains = domains.filter((_, i) => i !== index);
    setDomains(newDomains);
  };

  const handleSaveDomains = () => {
    if (!user?.organizationId) return;

    const filteredDomains = domains.filter((domain) => domain.trim() !== "");

    updateOrganizationMutation(
      {
        id: user.organizationId,
        organizationData: {
          domains: filteredDomains,
        },
      },
      {
        onSuccess: () => {
          setEditDomains(false);
          queryClient.invalidateQueries({
            queryKey: ["organization", user.organizationId],
          });
        },
      }
    );
  };

  const handleEditCancelDomains = () => {
    if (editDomains && organization) {
      setDomains(organization.domains || [""]);
    }
    setEditDomains(!editDomains);
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
        domains: organization.domains?.length ? organization.domains : [""],
      });
    }
  }, [organization]);

  useEffect(() => {
    if (organization) {
      setDomains(organization.domains?.length ? organization.domains : [""]);
    }
  }, [organization]);

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
          <div className="text-link-hover flex gap-2 items-center border-none border-r-[20px] p-[10px] px-[26px] rounded-3xl bg-[#242424]">
            <User size={17} />
            <span className="capitalize">{user?.accountType} Account</span>
          </div>
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
                        name="newPassword"
                        type="password"
                        value={userPasswordFormData.newPassword}
                        onChange={handlePasswordFormInputChange}
                      />
                      <Input
                        eye
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
        {user?.accountType === "business" && (
          <div className="mt-[77px]">
            <h3 className="text-[20px] leading-[27px] font-semibold">
              Company details
            </h3>
            <div className="w-full mt-6 pb-2 border-b border-[#444444]">
              <div className="flex justify-between items-start w-full">
                <div className="w-full">
                  <div className="flex flex-col gap-4">
                    <div className="relative">
                      <p className="text-[16px] leading-[22px] font-semibold mb-2">
                        Company name
                      </p>
                      <p className="text-[14px] leading-[29px] text-disabled font-medium">
                        {organization?.name || "Not provided"}
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-1">
                        <p className="text-[16px] leading-[22px] font-semibold mb-2">
                          Business registration number
                        </p>
                        <p className="text-[14px] leading-[29px] text-disabled font-medium">
                          {organization?.businessOrganizationNumber ||
                            "Not provided"}
                        </p>
                      </div>

                      <div className="flex-1">
                        <p className="text-[16px] leading-[22px] font-semibold mb-2">
                          VAT number
                        </p>
                        <p className="text-[14px] leading-[29px] text-disabled font-medium">
                          {organization?.VAT || "Not provided"}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-start w-full">
                      <div className="w-full">
                        <div className="flex flex-col gap-4">
                          <div>
                            <p className="text-[16px] leading-[22px] font-semibold mb-2">
                              Domain
                            </p>
                            {editDomains ? (
                              <div className="space-y-2">
                                {domains.map((domain, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center gap-2"
                                  >
                                    <Input
                                      value={domain}
                                      onChange={(e) =>
                                        handleDomainChange(
                                          index,
                                          e.target.value
                                        )
                                      }
                                      placeholder="Enter domain (e.g. @company.com)"
                                      className="flex-1 bg-[#242424] border-none text-[14px]"
                                    />
                                    {domains.length > 1 && (
                                      <Button
                                        variant="ghost"
                                        onClick={() => removeDomain(index)}
                                        className="p-2 hover:bg-red-500/10"
                                      >
                                        <X className="h-4 w-4 text-red-500" />
                                      </Button>
                                    )}
                                  </div>
                                ))}
                                <div className="flex gap-2 mt-4">
                                  <Button
                                    variant="secondary"
                                    onClick={addDomain}
                                    className="flex items-center gap-2 bg-[#242424] hover:bg-[#2f2f2f] border-none"
                                  >
                                    <Plus className="h-4 w-4" />
                                    Add Domain
                                  </Button>
                                  <Button
                                    variant="saveProfile"
                                    onClick={handleSaveDomains}
                                    className="w-[148px]"
                                  >
                                    Save
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <p className="tjext-[14px] leading-[29px] text-[#C4C4C4] font-medium">
                                {Array.isArray(organization?.domains)
                                  ? organization.domains.join(", ")
                                  : organization?.domains || "No domains added"}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button variant="edit" onClick={handleEditCancelDomains}>
                        {editDomains ? "Cancel" : "Edit"}
                      </Button>
                    </div>
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
