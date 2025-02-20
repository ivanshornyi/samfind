import { useContext } from "react";

import { AuthContext } from "@/context";

import {
  UserLicenseApiService,
  CreateUserLicense,
  UpdateUserLicenseData,
} from "@/services";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
    enabled: !!id,
    // stale time
  });
};

export const useGetUserLicenses = () => {
  const { user } = useContext(AuthContext);

  return useQuery({
    queryFn: () => UserLicenseApiService.getUserLicenses(user?.id ?? ""),
    queryKey: ["user-license-list", user?.id],
    enabled: !!user?.id,
    // stale time
  });
};

export const useUpdateUserLicense = () => {
  const { toast } = useToast();

  const { ...mutationProps } = useMutation({
    mutationFn: (data: { id: string; licenseData: UpdateUserLicenseData }) =>
      UserLicenseApiService.updateUserLicense(data.id, data.licenseData),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Successfully updated",
        variant: "success",
      });
    },
    onError: (error) => {
      handleToastError(error, toast);
    },
  });

  return mutationProps;
};

export const useDeleteMemberFromLicense = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { ...mutationProps } = useMutation({
    mutationFn: (activeLicenseId: string) =>
      UserLicenseApiService.deleteMemberFromLicense(activeLicenseId),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Member deleted",
        variant: "success",
      });

      queryClient.invalidateQueries({
        queryKey: ["user-license-list"],
        refetchType: "all",
      });
    },
    onError: (error) => {
      handleToastError(error, toast);
    },
  });

  return mutationProps;
};

export const useGetUserActiveLicense = (id?: string) => {
  return useQuery({
    queryFn: () => UserLicenseApiService.getUserActiveLicense(id!),
    queryKey: ["user-active-license"],
    enabled: !!id,
  });
};

export const useDeleteDeviceIdFromLicense = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { ...mutationProps } = useMutation({
    mutationFn: (data: {
      activeLicenseId: string;
      mobileId?: string;
      desktopId?: string;
    }) => UserLicenseApiService.deleteDeviceIdFromLicense(data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Device deleted",
        variant: "success",
      });

      queryClient.invalidateQueries({
        queryKey: ["user-active-license"],
        refetchType: "all",
      });
    },
    onError: (error) => {
      handleToastError(error, toast);
    },
  });

  return mutationProps;
};
