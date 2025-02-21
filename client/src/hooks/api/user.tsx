import { useContext } from "react";

import { AuthContext } from "@/context";

import {
  UpdateUserData,
  UpdateUserWalletData,
  UserApiService,
} from "@/services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useToast } from "../use-toast";

export const useGetUser = (id: string) => {
  return useQuery({
    queryFn: () => UserApiService.getUser(id),
    queryKey: ["users"],
  });
};

export const useUpdateUser = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: { id: string; userData: UpdateUserData }) => {
      return UserApiService.updateUser(data.id, data.userData);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Successfully updated",
        variant: "success",
      });
    },
  });
};

export const useGetUserRoleSubscriptionInfo = () => {
  const { user } = useContext(AuthContext);

  return useQuery({
    queryFn: () => UserApiService.getUserRoleSubscriptionInfo(user?.id ?? ""),
    queryKey: ["user-subscription-info"],
    enabled: !!user?.id,
    // staleTime: 5_000_000,
  });
};

export const useDeleteUser = () => {
  const { user, logout } = useContext(AuthContext);

  return useMutation({
    mutationFn: () => UserApiService.deleteUser(user?.id ?? ""),
    mutationKey: ["delete-user"],
    onSuccess: () => {
      logout();
    },
  });
};

export const useGetInvitedUserInfo = () => {
  const { user } = useContext(AuthContext);

  return useQuery({
    queryFn: () => UserApiService.getInvitedUserInfo(user?.id ?? ""),
    queryKey: ["invited-user-info"],
    enabled: !!user?.id,
    staleTime: 5_000_000,
  });
};

export const useGetUserSubscriptionInfo = () => {
  const { user } = useContext(AuthContext);

  return useQuery({
    queryFn: () =>
      user?.id ? UserApiService.getUserSubscriptionInfo(user?.id) : null,
    queryKey: ["subscription-user-info"],
    enabled: !!user?.id,
    // staleTime: 5_000_000,
  });
};

export const useGetUserOrganizationName = (organizationId?: string | null) => {
  return useQuery({
    queryFn: () => UserApiService.getUserOrganizationName(organizationId!),
    queryKey: ["user-organization-name", organizationId],
    enabled: !!organizationId,
  });
};

export const useGetUserName = (licenseId?: string | null) => {
  return useQuery({
    queryFn: () => UserApiService.getUserName(licenseId!),
    queryKey: ["user-name-name", licenseId],
    enabled: !!licenseId,
  });
};

export const useGetUserWallet = () => {
  const { user } = useContext(AuthContext);

  return useQuery({
    queryFn: () => UserApiService.getUseWallet(user?.id ?? ""),
    queryKey: ["user-wallet"],
    enabled: !!user?.id,
  });
};

export const useUpdateUserWallet = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserWalletData) => {
      return UserApiService.updateUserWallet(data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Successfully transferred",
        variant: "success",
      });

      queryClient.invalidateQueries({
        queryKey: ["user-wallet"],
        refetchType: "all",
      });
    },
  });
};
