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
      });
    },
  });
};

export const useGetUserSubscriptionInfo = () => {
  const { user } = useContext(AuthContext);

  return useQuery({
    queryFn: () => UserApiService.getUserSubscriptionInfo(user?.id ?? ""),
    queryKey: ["user-subscription-info"],
    enabled: !!user?.id,
  });
};
