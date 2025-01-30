import { useContext } from "react";

import { AuthContext } from "@/context";

import { UserLicenseApiService, CreateUserLicense, UpdateUserLicenseData } from "@/services";

import { useMutation, useQuery } from "@tanstack/react-query";

import { useToast } from "@/hooks";

import { handleToastError } from "@/errors";

export const useCreateUserLicense = () => {
  const { toast } = useToast();

  const { ...mutationProps } = useMutation({
    mutationFn: (data: CreateUserLicense) =>
      UserLicenseApiService.addUserLicense(data),
    onError: (error) => {
      handleToastError(error, toast);
    },
  });

  return mutationProps;
};

export const useGetUserLicense = (id: string) => {
  return useQuery({
    queryFn: () => UserLicenseApiService.getUserLicense(id),
    queryKey: ["user-license"],
  });
};

export const useGetUserLicenses = () => {
  const { user } = useContext(AuthContext);

  return useQuery({
    queryFn: () => UserLicenseApiService.getUserLicenses(user?.id ?? ""),
    queryKey: ["user-license-list", user?.id],
    enabled: !!user?.id,
  });
};

export const useUpdateUserLicense = () => {
  const { toast } = useToast();

  const { ...mutationProps } = useMutation({
    mutationFn: (data: { id: string, licenseData: UpdateUserLicenseData }) => UserLicenseApiService.updateUserLicense(data.id, data.licenseData),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Successfully updated",
      });
    },
    onError: (error) => {
      handleToastError(error, toast);
    },
  });

  return mutationProps;
};
