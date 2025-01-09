import { User } from "@shared/types";
import { userApiService } from "@/services";
import { useQuery } from "@tanstack/react-query";

export const useFindUsers = () => {
  return useQuery<User[]>({
    queryFn: () => userApiService.findUsers(),
    queryKey: ["users"],
  });
};
