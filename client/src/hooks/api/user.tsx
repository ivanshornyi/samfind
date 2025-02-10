import { useContext } from "react";

import { AuthContext } from "@/context";

import { UserApiService, UpdateUserData } from "@/services";
import { useMutation, useQuery } from "@tanstack/react-query";

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
    queryFn: () => user?.id ? UserApiService.getUserSubscriptionInfo(user?.id) : null,
    queryKey: ["subscription-user-info"],
    enabled: !!user?.id,
    // staleTime: 5_000_000,
  });
};
