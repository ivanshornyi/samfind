import { User, UserReferralInfo } from "@shared/types";
import { userApiService } from "@/services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { handleToastError } from "@/errors";
import { useToast } from "@/hooks";

export const useFindUsers = (name: string | undefined, offset: number, limit: number) => {
  return useQuery<User[] | undefined>({
    queryFn: () => userApiService.findUsers(name || "", offset, limit),
    queryKey: ["users", name, offset],
  });
};

export const useUserReferralInfo = (id: string) => {
  return useQuery<UserReferralInfo | undefined>({
    queryFn: () => userApiService.getUserReferralInfo(id),
    queryKey: ["user-referrals", id],
    enabled: !!id,
  });
};

export const useUpdateUser = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { ...rest } = useMutation({
    mutationFn: (data: { userId: string; user: Partial<User> }) =>
      userApiService.updateUser(data.userId, data.user),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      toast({
        title: "Success",
        description: "Successfully updated user",
      });
    },
    onError: (error) => {
      handleToastError(error, toast);
    },
  });

  return rest;
};
