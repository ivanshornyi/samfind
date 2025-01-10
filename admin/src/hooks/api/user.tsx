import { User } from "@shared/types";
import { userApiService } from "@/services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { handleToastError } from "@/errors";
import { useToast } from "../use-toast";

export const useFindUsers = () => {
  return useQuery<User[]>({
    queryFn: () => userApiService.findUsers(),
    queryKey: ["users"],
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
